import sys
import urllib.request
import os
import mysql.connector
import ssl
import certifi
import datetime

def getRates(year):
    openssl_dir, openssl_cafile = os.path.split(      
    ssl.get_default_verify_paths().openssl_cafile)
    mydb = mysql.connector.connect(
        host="db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com",
        user="admin",
        password="prorep$2023!",
        database="rigk-sgr"
    )
    mycursor = mydb.cursor()

    # arch = open("out.sql", "w")
    some_url = "https://www.sii.cl/valores_y_fechas/uf/uf{0}.htm".format(year)
    request = urllib.request.Request(some_url)
    response = urllib.request.urlopen(request,context=ssl.create_default_context(cafile=certifi.where()))

    htmlBytes = response.read()
    htmlStr = htmlBytes.decode("utf8")
    htmlSplit = htmlStr.split('\n')

    dia = 0
    divs = 0
    flag = False
    flag2 = False
    mes_actual = 1

    for line in htmlSplit:
        if divs == -1:
            break
        if 'mes_all' in line:
            flag = True
        if flag == False:
            continue
        if flag2 == True:
            if 'th' in line:
                dia = line.split(";'>")[1].split("</th>")[0]
            if 'td' in line:
                print(line)
                val = line.split(";'>")[1].split("</td>")[0]
                if len(str(mes_actual)) == 1:
                    mes_actual = "0"+str(mes_actual)
                date_query = "{0}/{1}/{2}".format(year,mes_actual,dia)
                if "&nbsp" in val:
                    val = "NaN"
                    mes_actual = int(mes_actual) + 1
                    continue
                _query = "INSERT IGNORE INTO uf VALUES(%s, %s)"
                val = (date_query, val.replace(".",'').replace(",","."))
                
                mycursor.execute(_query, val)
                mydb.commit()
                mes_actual = int(mes_actual) + 1
            if '<tr>' in line:
                print("a")
                mes_actual = 1
        if '<tbody>' in line:
            flag2 = True
            divs +=1
        if '</table>' in line:
            break
    # arch.close()

def updateStatement():
    mydb = mysql.connector.connect(
        host="db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com",
        user="admin",
        password="prorep$2023!",
        database="rigk-sgr"
    )
    mycursor = mydb.cursor()

    query = "update header_statement_form set STATE = 0 where state = 2 and TIMESTAMPDIFF(second,CREATED_AT,now()) > 86400"
    # query = "update header_statement_form set STATE = 0 where ID = 217"

    mycursor.execute(query)
    mydb.commit()

def main(argv):
    try:
        year = datetime.datetime.now().year
        print("año "+str(year))
        getRates(year)
        print("Actualización de UF OK")
        updateStatement()
        print("Actualización de declaraciones OK")
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main(sys.argv[1:])
