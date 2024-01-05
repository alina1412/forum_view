from flask import Flask
from flask_mysqldb import MySQL

# Configure application
# sess = Session()
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = "my secret key"
# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
app.config["MYSQL_PORT"] = 3306
app.config["MYSQL_DB"] = os.getenv("MYSQL_DB")
app.config["MYSQL_CURSORCLASS"] = "DictCursor"

with app.app_context():
    db = MySQL(app)

    cur = db.connection.cursor()
    sql = '''select code, smile_url from phpbb_1smilies ORDER BY LENGTH(code) DESC;'''
    cur.execute(sql)
    res_smilies = cur.fetchall()
    app.config["smilies"] = res_smilies
   