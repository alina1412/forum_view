from flask import Flask
# from flask_mysqldb import MySQL

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

from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
 
# Configure the database
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

db.init_app(app)


# Load smilies from PostgreSQL
with app.app_context():
    try:
        result = db.session.execute(text("SELECT code, smile_url FROM dennikov.phpbb_1smilies ORDER BY LENGTH(code) DESC"))
        res_smilies = result.fetchall()
        app.config["smilies"] = res_smilies
    except Exception as e:
        print(f"Smilies table not found or error: {e}")
        app.config["smilies"] = []

@app.route('/2')
def index():
    # Execute the requested SQL query
    try:
        result = db.session.execute(text("SELECT post_id, post_text FROM dennikov.phpbb_1posts_text limit 3;"))
        categories = result.fetchall()
        
        if categories:
            # Format the results for display
            cat_list = [f"{cat.post_text} (ID: {cat.post_id})" for cat in categories]
            return f"Categories from dennikov.phpbb_1categories: {', '.join(cat_list)}"
        return 'No categories found in dennikov.phpbb_1categories table.'
    except Exception as e:
        return f"Error fetching categories: {e}"
