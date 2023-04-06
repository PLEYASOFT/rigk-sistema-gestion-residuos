import mysql.connector

# Conectar a la base de datos
cnx = mysql.connector.connect(user='admin', password='prorep$2023!',
                              host='db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com',
                              database='rigk-sgr')

# Crear un cursor
cursor = cnx.cursor()

# Ejecutar una consulta SQL
query = "SELECT * FROM user;"
cursor.execute(query)

# Obtener los resultados
results = cursor.fetchall()

# Imprimir los resultados
for row in results:
    print(row)

# Cerrar el cursor y la conexión
cursor.close()
cnx.close()
