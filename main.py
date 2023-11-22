from flask import Flask, render_template, request
from flask_mysqldb import MySQL

app = Flask(__name__)

# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'root'
# app.config['MYSQL_DB'] = 'flask'

# mysql = MySQL(app)


# Creating a connection cursor
# cursor = mysql.connection.cursor()

# Executing SQL Statements
# cursor.execute(''' CREATE TABLE table_name(field1, field2...) ''')
# cursor.execute(''' INSERT INTO table_name VALUES(v1,v2...) ''')
# cursor.execute(''' DELETE FROM table_name WHERE condition ''')

# Saving the Actions performed on the DB
# mysql.connection.commit()

# Closing the cursor
# cursor.close()


@app.route("/")
def form():
    return render_template("index.html")


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "GET":
        return "Login via the login Form"

    if request.method == "POST":
        name = request.form["name"]
        age = request.form["age"]
        cursor = mysql.connection.cursor()
        cursor.execute(""" INSERT INTO info_table VALUES(%s,%s)""", (name, age))
        mysql.connection.commit()
        cursor.close()
        return f"Done!!"


app.run(host="localhost", port=5000)
