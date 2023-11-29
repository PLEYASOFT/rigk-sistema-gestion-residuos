import mysql.connector
import pandas as pd
import numpy as np
import sys
# Definición de constantes
ANIO_INICIAL = 2022
MAPEO_TIPOS_RESIDUO_CI = {1: [1, 2, 3, 4, 5 , 6], 2: [7, 8, 9, 10, 11], 3: [12, 13, 14, 15, 16, 17]}
MAPEO_TIPOS_RESIDUO_PROD = {1: [1], 2: [2], 3: [3]}
MONTHS = {
    1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
    5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
    9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
}

# Definición de conexión a la base de datos de origen
source_db = mysql.connector.connect(
    host="db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com",
    user="prorep_sa",
    passwd="5ty%fT9_2FDGGguyte67%",
    database="rigk-sgr"
)

# Definición de conexión a la base de datos de destino
target_db = mysql.connector.connect(
    host="db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com",
    user="prorep_sa",
    passwd="5ty%fT9_2FDGGguyte67%",
    database="rigk-sgr-dm"
)

cursor = target_db.cursor()

# Limpieza de las tablas
tablas_a_limpiar = [
    "tbd_cum_anio",
    "tbd_cum_materiales",
    "tbd_cum_meses",
    "tbh_porc_cump_ci"
]

for tabla in tablas_a_limpiar:
    cursor.execute(f"DELETE FROM {tabla}")

# Se obtienen metas de la base de datos
query_goals = """
    SELECT YEAR, TYPE_MATERIAL, PERCENTAGE_CUM
    FROM goals
    WHERE YEAR >= {}
"""
goals = pd.read_sql(query_goals.format(ANIO_INICIAL), con=source_db)
goals.set_index(['YEAR', 'TYPE_MATERIAL'], inplace=True)

goals.index = goals.index.set_levels(goals.index.levels[0].astype(int), level=0) 
goals.index = goals.index.set_levels(goals.index.levels[1].astype(str), level=1) 

query_ci = """
    SELECT d.ID, d.VALUE, h.YEAR_STATEMENT, d.TYPE_RESIDUE, h.UPDATED_AT
    FROM detail_industrial_consumer_form AS d
    INNER JOIN header_industrial_consumer_form AS h ON d.ID_HEADER = h.ID
    INNER JOIN type_treatment AS tt ON d.TREATMENT_TYPE = tt.ID
    WHERE h.YEAR_STATEMENT >= {}
    AND tt.NAME IN ('Reciclaje Interno', 'Reciclaje Mecánico', 'Valorización Energética')
"""
ton_ci = pd.read_sql(query_ci.format(ANIO_INICIAL), con=source_db)

query_prod = """
    SELECT d.ID, d.VALUE, h.YEAR_STATEMENT, d.TYPE_RESIDUE, h.STATE, h.UPDATED_AT
    FROM detail_statement_form AS d
    INNER JOIN header_statement_form AS h
    ON d.ID_HEADER = h.ID
    WHERE h.YEAR_STATEMENT >= {} - 1 AND (d.RECYCLABILITY = 1 OR d.RECYCLABILITY = 2)
"""
ton_prod = pd.read_sql(query_prod.format(ANIO_INICIAL), con=source_db)

ton_prod.loc[ton_prod['STATE'] != 1, 'VALUE'] = 0
for new_type, old_types in MAPEO_TIPOS_RESIDUO_CI.items():
    ton_ci.loc[ton_ci['TYPE_RESIDUE'].isin(old_types), 'TYPE_RESIDUE'] = new_type

for new_type, old_types in MAPEO_TIPOS_RESIDUO_PROD.items():
    ton_prod.loc[ton_prod['TYPE_RESIDUE'].isin(old_types), 'TYPE_RESIDUE'] = new_type

ton_ci = ton_ci[ton_ci['TYPE_RESIDUE'].isin([1, 2, 3])]
# Convertir kilogramos a toneladas dividiendo la columna VALUE por 1000
ton_ci['VALUE'] = ton_ci['VALUE'] / 1000

# Mostrar el DataFrame actualizado
ton_prod = ton_prod[ton_prod['TYPE_RESIDUE'].isin([1, 2, 3])]

ton_ci['UPDATED_AT'] = pd.to_datetime(ton_ci['UPDATED_AT'])
ton_ci['MONTH'] = ton_ci['UPDATED_AT'].dt.month
ton_prod['UPDATED_AT'] = pd.to_datetime(ton_prod['UPDATED_AT'])
ton_prod['MONTH'] = ton_prod['UPDATED_AT'].dt.month

ton_prod_by_year_month = ton_prod.groupby(['YEAR_STATEMENT', 'MONTH', 'TYPE_RESIDUE'])['VALUE'].sum()
ton_ci_by_year_month = ton_ci.groupby(['YEAR_STATEMENT', 'MONTH', 'TYPE_RESIDUE'])['VALUE'].sum()
ton_ci_by_year = ton_ci.groupby(['YEAR_STATEMENT', 'TYPE_RESIDUE'])['VALUE'].sum()
ton_prod_by_year = ton_prod.groupby(['YEAR_STATEMENT', 'TYPE_RESIDUE'])['VALUE'].sum()

idx = pd.MultiIndex.from_product([ton_ci_by_year.index.levels[0], [1, 2, 3]], names=['YEAR_STATEMENT', 'TYPE_RESIDUE'])
idy = pd.MultiIndex.from_product([ton_prod_by_year.index.levels[0], [1, 2, 3]], names=['YEAR_STATEMENT', 'TYPE_RESIDUE'])
ton_ci_by_year = ton_ci_by_year.reindex(idx, fill_value=0)
ton_prod_by_year = ton_prod_by_year.reindex(idy, fill_value=0)
total_ton_ci = ton_ci_by_year.groupby('YEAR_STATEMENT').sum()
total_ton_prod = ton_prod_by_year.groupby('YEAR_STATEMENT').sum()

id_cump = 1
fact_data = []
intermediate_anio_data = []
intermediate_material_data = []
intermediate_mes_data = []

ton_prod_sums = ton_prod_by_year_month.groupby(['YEAR_STATEMENT', 'MONTH']).sum()
ton_ci_sums = ton_ci_by_year_month.groupby(['YEAR_STATEMENT', 'MONTH']).sum()

ton_prod_sums = ton_prod_sums.reset_index()
ton_ci_sums = ton_ci_sums.reset_index()

ton_prod_sums['TYPE_RESIDUE'] = 0
ton_ci_sums['TYPE_RESIDUE'] = 0

ton_prod_by_year_month = pd.concat([ton_prod_by_year_month.reset_index(), ton_prod_sums], ignore_index=True)
ton_ci_by_year_month = pd.concat([ton_ci_by_year_month.reset_index(), ton_ci_sums], ignore_index=True)

ton_prod_by_year_month = ton_prod_by_year_month.set_index(['YEAR_STATEMENT', 'MONTH', 'TYPE_RESIDUE']).sort_index()
ton_ci_by_year_month = ton_ci_by_year_month.set_index(['YEAR_STATEMENT', 'MONTH', 'TYPE_RESIDUE']).sort_index()

ton_prod_cumulative = ton_prod_by_year_month.groupby(['YEAR_STATEMENT', 'TYPE_RESIDUE']).cumsum()
ton_ci_cumulative = ton_ci_by_year_month.groupby(['YEAR_STATEMENT', 'TYPE_RESIDUE']).cumsum()
meses = list(range(1, 13))
types_residue = [0, 1, 2, 3]

def calcular_acumulado(dataframe, year):
    records = []
    for residue in types_residue:
        ultimo_valor = 0
        for mes in meses:
            try:
                value = dataframe.loc[(year, mes, residue), 'VALUE']
            except KeyError:
                value = ultimo_valor
            records.append((year, mes, residue, value))
            ultimo_valor = value  
    return records

records_prod = []
records_ci = []

for year in ton_ci_cumulative.index.get_level_values('YEAR_STATEMENT').unique():
    records_ci.extend(calcular_acumulado(ton_ci_cumulative, year))

for year in ton_prod_cumulative.index.get_level_values('YEAR_STATEMENT').unique():
    records_prod.extend(calcular_acumulado(ton_prod_cumulative, year))

df_prod = pd.DataFrame(records_prod, columns=['YEAR_STATEMENT', 'MONTH', 'TYPE_RESIDUE', 'VALUE'])
df_ci = pd.DataFrame(records_ci, columns=['YEAR_STATEMENT', 'MONTH', 'TYPE_RESIDUE', 'VALUE'])
def calcular_cumplimiento(row, metas):
    ton_extra = 0
    ton_meta = 0
    
    try:
        ton_prod = df_prod[(df_prod['YEAR_STATEMENT'] == row['YEAR_STATEMENT'] - 1) & (df_prod['MONTH'] == 12) & (df_prod['TYPE_RESIDUE'] == 0)]['VALUE'].sum()
    except IndexError:
        ton_prod = 0
    ton_valorizada = row['VALUE']

    if ton_prod == 0:
        cumplimiento = 0
        ton_extra    = 0 
        ton_meta     = 0
        return cumplimiento, ton_extra, ton_meta
    
    meta_material = metas.loc[str(int(row['TYPE_RESIDUE'])), 'PERCENTAGE_CUM']
    meta_global = metas.loc[str(0), 'PERCENTAGE_CUM']
    
    if meta_material == 0:
        cumplimiento = 0
        ton_extra    = 0 
        ton_meta     = 0
        return cumplimiento, ton_extra, ton_meta
    

    if int(row['TYPE_RESIDUE']) in [1, 2, 3]:
        ton_prod = df_prod[(df_prod['YEAR_STATEMENT'] == row['YEAR_STATEMENT'] - 1) & (df_prod['MONTH'] == 12) & (df_prod['TYPE_RESIDUE'] == int(row['TYPE_RESIDUE']))]['VALUE'].sum()
        ton_meta = ton_prod * meta_material * meta_global
        cumplimiento = ton_valorizada / (ton_prod * meta_material * meta_global)
        if cumplimiento > 1:
            ton_extra = ton_valorizada - (ton_prod * meta_material * meta_global)
    else:
        meta_papel = metas.loc[str(1), 'PERCENTAGE_CUM']
        meta_metal = metas.loc[str(2), 'PERCENTAGE_CUM']
        meta_plastico = metas.loc[str(3), 'PERCENTAGE_CUM']
        ton_papel = df_prod[(df_prod['YEAR_STATEMENT'] == row['YEAR_STATEMENT'] - 1) & (df_prod['MONTH'] == 12) & (df_prod['TYPE_RESIDUE'] == 1)]['VALUE'].sum()
        ton_metal = df_prod[(df_prod['YEAR_STATEMENT'] == row['YEAR_STATEMENT'] - 1) & (df_prod['MONTH'] == 12) & (df_prod['TYPE_RESIDUE'] == 2)]['VALUE'].sum()
        ton_plastico = df_prod[(df_prod['YEAR_STATEMENT'] == row['YEAR_STATEMENT'] - 1) & (df_prod['MONTH'] == 12) & (df_prod['TYPE_RESIDUE'] == 3)]['VALUE'].sum()
        ton_meta = (ton_papel * meta_papel + ton_metal * meta_metal + ton_plastico * meta_plastico) * meta_global
        cumplimiento = ton_valorizada / (ton_meta)

    return cumplimiento, ton_extra, ton_meta

for year in df_ci['YEAR_STATEMENT'].unique():
    try:
        metas_anio = goals.loc[year]
    except KeyError:
        continue
    results = df_ci[df_ci['YEAR_STATEMENT'] == year].apply(lambda row: calcular_cumplimiento(row, metas_anio), axis=1)

    # Convierte números individuales a (0,0,0)
    results = results.apply(lambda x: (0,0,0) if isinstance(x, (int, float)) else x)
    
    df_ci.loc[df_ci['YEAR_STATEMENT'] == year, 'CUMPLIMIENTO'] = results.apply(lambda x: x[0])
    df_ci.loc[df_ci['YEAR_STATEMENT'] == year, 'PESO_EXTRA'] = results.apply(lambda x: x[1])
    df_ci.loc[df_ci['YEAR_STATEMENT'] == year, 'PESO_META'] = results.apply(lambda x: x[2])

#Verifica si CI está vacío
if df_ci.empty:
    sys.exit()
# Crear la columna SOBREPESO
df_ci['SOBREPESO'] = df_ci['CUMPLIMIENTO'] > 1
df_ci['CUMPLIMIENTO'] = df_ci['CUMPLIMIENTO'].replace([np.inf, -np.inf, np.nan], 0)
df_ci = df_ci[df_ci['YEAR_STATEMENT'] >= ANIO_INICIAL]

def calcular_prorrateo(df_month, metas_anio):
    # Obtenemos los registros de los materiales
    mat1 = df_month[df_month['TYPE_RESIDUE'] == 1].iloc[0]
    mat2 = df_month[df_month['TYPE_RESIDUE'] == 2].iloc[0]
    mat3 = df_month[df_month['TYPE_RESIDUE'] == 3].iloc[0]
    while mat1['SOBREPESO'] or mat2['SOBREPESO'] or mat3['SOBREPESO']:
        if mat1['SOBREPESO'] and mat2['SOBREPESO'] and mat3['SOBREPESO']:
            total_extra = mat1['PESO_EXTRA'] + mat2['PESO_EXTRA'] + mat3['PESO_EXTRA']
            df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
            df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] -= mat2['PESO_EXTRA']
            df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] -= mat3['PESO_EXTRA']
            df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] += total_extra/3
            df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] += total_extra/3
            df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] += total_extra/3
            mat1['SOBREPESO'] = False 
            mat2['SOBREPESO'] = False
            mat3['SOBREPESO'] = False
        elif mat1['SOBREPESO']:
            if mat3['SOBREPESO']: # si mat1 y mat3 tienen sobrepeso
                total_extra = mat1['PESO_EXTRA'] + mat3['PESO_EXTRA']
                df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] += total_extra
                df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_EXTRA'] = df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_META'] - df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE']
                if df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_EXTRA'].iloc[0] > 0: #mat2 no supera meta
                    mat1['SOBREPESO'] = False
                    mat2['SOBREPESO'] = False
                    mat3['SOBREPESO'] = False
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] -= mat3['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = 0
                    mat2['PESO_EXTRA'] = 0
                else: #si value mat2 supera meta, todos tienen sobrepeso
                    mat1['SOBREPESO'] = True
                    mat2['SOBREPESO'] = True
                    mat3['SOBREPESO'] = True
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] -= mat3['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = 0
                    mat2['PESO_EXTRA'] = (df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_EXTRA'].iloc[0]) * (-1)
            else: #mat3 no tiene sobrepeso
                total_extra = mat1['PESO_EXTRA']
                df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] += total_extra
                df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_EXTRA'] = df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_META'] - df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE']
                if df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_EXTRA'].iloc[0] > 0: #mat3 no supera meta
                    mat1['SOBREPESO'] = False
                    mat3['SOBREPESO'] = False
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = 0
                else:#mat3  supera meta
                    mat1['SOBREPESO'] = True
                    mat3['SOBREPESO'] = True
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = (df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_EXTRA'].iloc[0]) * (-1)
        elif mat2['SOBREPESO']:
            if mat1['SOBREPESO']: # si mat2 y mat1 tienen sobrepeso
                total_extra = mat1['PESO_EXTRA'] + mat2['PESO_EXTRA']
                df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] += total_extra
                df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_EXTRA'] = df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_META'] - df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE']
                if df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_EXTRA'].iloc[0] > 0: #mat3 no supera meta
                    mat1['SOBREPESO'] = False
                    mat2['SOBREPESO'] = False
                    mat3['SOBREPESO'] = False
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] -= mat2['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = 0
                    mat2['PESO_EXTRA'] = 0
                else: #si value mat3 supera meta, todos tienen sobrepeso
                    mat1['SOBREPESO'] = True
                    mat2['SOBREPESO'] = True
                    mat3['SOBREPESO'] = True
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] -= mat2['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat2['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = (df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'PESO_EXTRA'].iloc[0]) * (-1)
            else: #mat1 no tiene sobrepeso
                total_extra = mat2['PESO_EXTRA']
                df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] += total_extra
                df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_EXTRA'] = df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_META'] - df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE']
                if df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_EXTRA'].iloc[0] > 0: #mat1 no supera meta
                    mat1['SOBREPESO'] = False
                    mat2['SOBREPESO'] = False
                    df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] -= mat2['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat2['PESO_EXTRA'] = 0
                else:#mat1  supera meta
                    mat2['SOBREPESO'] = True
                    mat1['SOBREPESO'] = True
                    df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] -= mat2['PESO_EXTRA']
                    mat2['PESO_EXTRA'] = 0
                    mat1['PESO_EXTRA'] = (df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_EXTRA'].iloc[0]) * (-1)
        elif mat3['SOBREPESO']:
            if mat1['SOBREPESO']: # si mat3 y mat1 tienen sobrepeso
                total_extra = mat1['PESO_EXTRA'] + mat3['PESO_EXTRA']
                df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE'] += total_extra
                df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_EXTRA'] = df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_META'] - df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'VALUE']
                if df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_EXTRA'].iloc[0] > 0: #mat2 no supera meta
                    mat1['SOBREPESO'] = False
                    mat2['SOBREPESO'] = False
                    mat3['SOBREPESO'] = False
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] -= mat3['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = 0
                    mat2['PESO_EXTRA'] = 0
                else: #si value mat2 supera meta, todos tienen sobrepeso
                    mat1['SOBREPESO'] = True
                    mat2['SOBREPESO'] = True
                    mat3['SOBREPESO'] = True
                    df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] -= mat1['PESO_EXTRA']
                    df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] -= mat3['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = 0
                    mat2['PESO_EXTRA'] = (df_month.loc[df_month['TYPE_RESIDUE'] == 2, 'PESO_EXTRA'].iloc[0]) * (-1)
            else: #mat1 no tiene sobrepeso
                total_extra = mat3['PESO_EXTRA']
                df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE'] += total_extra
                df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_EXTRA'] = df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_META'] - df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'VALUE']
                if df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_EXTRA'].iloc[0] > 0: #mat1 no supera meta
                    mat1['SOBREPESO'] = False
                    mat3['SOBREPESO'] = False
                    df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] -= mat3['PESO_EXTRA']
                    mat1['PESO_EXTRA'] = 0
                    mat3['PESO_EXTRA'] = 0
                else:#mat1  supera meta
                    mat3['SOBREPESO'] = True
                    mat1['SOBREPESO'] = True
                    df_month.loc[df_month['TYPE_RESIDUE'] == 3, 'VALUE'] -= mat3['PESO_EXTRA']
                    mat3['PESO_EXTRA'] = 0
                    mat1['PESO_EXTRA'] = (df_month.loc[df_month['TYPE_RESIDUE'] == 1, 'PESO_EXTRA'].iloc[0]) * (-1)
    for idx, row in df_month.iterrows():
        try:
            metas_anio = goals.loc[df_month.at[idx, 'YEAR_STATEMENT']]
        except KeyError:
            continue
        cumplimiento, ton_extra, ton_meta = calcular_cumplimiento(row, metas_anio)
        df_month.at[idx, 'CUMPLIMIENTO'] = cumplimiento
        df_month.at[idx, 'PESO_EXTRA'] = ton_extra
        df_month.at[idx, 'PESO_META'] = ton_meta

    return df_month

df_ci_grouped = df_ci.groupby(['YEAR_STATEMENT', 'MONTH'])

def aplicar_prorrateo_condicional(df, metas_anio):
    # Solo aplicamos prorrateo si el año es <= 2025
    if df['YEAR_STATEMENT'].iloc[0] <= 2025:
        return calcular_prorrateo(df, metas_anio)
    return df

df_ci = df_ci_grouped.apply(lambda x: aplicar_prorrateo_condicional(x, metas_anio)).reset_index(drop=True)

for index, cumplimiento in df_ci.iterrows():
    id_cump
    tipo = int(cumplimiento['TYPE_RESIDUE'])
    year = int(cumplimiento['YEAR_STATEMENT'])
    cump = cumplimiento['CUMPLIMIENTO']
    ton_valorizada = cumplimiento['VALUE']
    mes = int(cumplimiento['MONTH'])
    fact_data.append((id_cump, cump, ton_valorizada))
    query_anio = "SELECT ID FROM tbm_anios WHERE ANIO = %s"
    cursor.execute(query_anio, [year])
    id_anio = cursor.fetchone()[0]
    query_material = "SELECT ID FROM tbm_materiales WHERE ID = %s"
    cursor.execute(query_material, [tipo])
    id_material = cursor.fetchone()[0]
    query_mes = "SELECT ID FROM tbm_meses WHERE ID = %s"
    cursor.execute(query_mes, [mes]) 
    id_mes = cursor.fetchone()[0]
    intermediate_anio_data.append((id_cump, id_anio))
    intermediate_material_data.append((id_cump, id_material))
    intermediate_mes_data.append((id_cump, id_mes))
    id_cump += 1

cursor.executemany("""
    INSERT INTO tbh_porc_cump_ci (ID, VALOR_CUM, VALOR_TON_VAL) 
    VALUES (%s, %s, %s) 
    ON DUPLICATE KEY UPDATE VALOR_CUM = VALUES(VALOR_CUM), VALOR_TON_VAL = VALUES(VALOR_TON_VAL)
""", fact_data)
cursor.executemany("""
    INSERT INTO tbd_cum_anio (ID_CUMP, ID_ANIO) 
    VALUES (%s, %s) 
    ON DUPLICATE KEY UPDATE ID_ANIO = VALUES(ID_ANIO)
""", intermediate_anio_data)
cursor.executemany("""
    INSERT INTO tbd_cum_materiales (ID_CUMP, ID_MATERIAL) 
    VALUES (%s, %s) 
    ON DUPLICATE KEY UPDATE ID_MATERIAL = VALUES(ID_MATERIAL)
""", intermediate_material_data)
cursor.executemany("""
    INSERT INTO tbd_cum_meses (ID_CUMP, ID_MES) 
    VALUES (%s, %s) 
    ON DUPLICATE KEY UPDATE ID_MES = VALUES(ID_MES)
""", intermediate_mes_data)
target_db.commit()