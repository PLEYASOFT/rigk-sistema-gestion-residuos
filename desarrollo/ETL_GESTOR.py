import mysql.connector

# Conexión a la base de datos de destino
target_db = mysql.connector.connect(
    host="db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com",
    user="prorep_sa",
    passwd="5ty%fT9_2FDGGguyte67%",
    database="rigk-sgr-dm"
)

cursor = target_db.cursor()

# Limpieza de las tablas
tablas_a_limpiar = [
    "tbd_pesos_anio",
    "tbd_pesos_business",
    "tbd_pesos_materiales",
    "tbd_pesos_mes",
    "tbd_pesos_treatments",
    "tbh_pesos_ci"
]

for tabla in tablas_a_limpiar:
    cursor.execute(f"DELETE FROM {tabla}")

# Conexión a la base de datos de origen
source_db = mysql.connector.connect(
    host="db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com",
    user="prorep_sa",
    passwd="5ty%fT9_2FDGGguyte67%",
    database="rigk-sgr"
)

# Extraer los datos relevantes de la base de datos origen
query = """
    SELECT
    d.ID as detail_id,
    d.VALUE as peso_declarado,
    i.VALUE as peso_valorizado,
    i.CREATED_AT,  
    inv.TREATMENT_TYPE,
    inv.MATERIAL_TYPE,
    eb.ID_BUSINESS, 
    i.ID_INVOICE
FROM detail_industrial_consumer_form d
LEFT JOIN header_industrial_consumer_form h ON d.ID_HEADER = h.ID
LEFT JOIN establishment e ON h.ID_ESTABLISHMENT = e.ID
LEFT JOIN establishment_business eb ON e.ID = eb.ID_ESTABLISHMENT
LEFT JOIN invoices_detail i ON d.ID = i.ID_DETAIL
LEFT JOIN invoices inv ON i.ID_INVOICE = inv.ID
WHERE d.STATE_GESTOR = 1 AND h.YEAR_STATEMENT >= 2023 AND eb.ID_BUSINESS IS NOT NULL
"""

source_cursor = source_db.cursor()
source_cursor.execute(query)
records = source_cursor.fetchall()

# Transformar y cargar datos a la base de datos destino
for record in records:
    detail_id, peso_declarado, peso_valorizado, created_at, treatment_type, material_type, id_business, id_invoice = record

    # Insertar en tbh_pesos_ci
    insert_query_tbh = """
    INSERT INTO tbh_pesos_ci (ID, PESO_DECLARADO, PESO_VALORIZADO) 
    VALUES (%s, %s, %s) 
    ON DUPLICATE KEY UPDATE PESO_DECLARADO = %s, PESO_VALORIZADO = %s
    """
    cursor.execute(insert_query_tbh, (detail_id, peso_declarado, peso_valorizado, peso_declarado, peso_valorizado))
    last_id = detail_id
    # Insertar en tbd_pesos_treatments
    insert_query_treatments = "INSERT INTO tbd_pesos_treatments (ID_PESOS, ID_TREATMENT) VALUES (%s, %s) ON DUPLICATE KEY UPDATE ID_PESOS = %s"
    cursor.execute(insert_query_treatments, (last_id, treatment_type, last_id))

    # Extraer mes y año de date_pr
    mes = created_at.month
    anio = created_at.year
    get_year_id_query = "SELECT ID FROM tbm_anios WHERE ANIO = %s"
    cursor.execute(get_year_id_query, (anio,))
    year_id_result = cursor.fetchone()

    # Si el año existe, obtenemos el ID. De lo contrario, puedes decidir si quieres insertar un nuevo año o manejar el error.
    if year_id_result:
        year_id = year_id_result[0]
    else:
        # Aquí puedes decidir si quieres insertar un nuevo año en tbm_anios o manejar el error de otra manera.
        raise ValueError(f"El año {anio} no se encuentra en tbm_anios")

    # Luego insertamos en tbd_pesos_anio usando el ID obtenido
    insert_query_anio = "INSERT INTO tbd_pesos_anio (ID_PESOS, ID_ANIO) VALUES (%s, %s) ON DUPLICATE KEY UPDATE ID_PESOS = %s"
    cursor.execute(insert_query_anio, (last_id, year_id, last_id))

    # Insertar en tbd_pesos_mes
    insert_query_mes = "INSERT INTO tbd_pesos_mes (ID_PESOS, ID_MES) VALUES (%s, %s) ON DUPLICATE KEY UPDATE ID_PESOS = %s"
    cursor.execute(insert_query_mes, (last_id, mes, last_id))

    # Insertar en tbd_pesos_materiales
    insert_query_materiales = "INSERT INTO tbd_pesos_materiales (ID_PESOS, ID_MATERIALES) VALUES (%s, %s) ON DUPLICATE KEY UPDATE ID_PESOS = %s"
    cursor.execute(insert_query_materiales, (last_id, material_type, last_id))

    # Insertar en tbd_pesos_business
    insert_query_business = "INSERT INTO tbd_pesos_business (ID_PESOS, ID_BUSINESS) VALUES (%s, %s) ON DUPLICATE KEY UPDATE ID_PESOS = %s"
    cursor.execute(insert_query_business, (last_id, id_business, last_id))

# Commit a la base de datos destino
target_db.commit()

# Cerrar conexiones y cursores
source_cursor.close()
cursor.close()
source_db.close()
target_db.close()
