"""Only to load data and check db"""

import csv
import os

from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

load_dotenv()

app = Flask(__name__)
app.secret_key = "my secret key"


db = SQLAlchemy()
database_url = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
db.init_app(app)


def insert_to_phpbb_1posts():
    ins1 = """
    INSERT INTO phpbb_1posts (post_id, topic_id, forum_id, 
        poster_id, post_time, poster_ip, post_username, enable_bbcode, 
        enable_html, enable_smilies, enable_sig, post_edit_time, 
        post_edit_count)
    VALUES (:post_id, :topic_id, :forum_id, 
        :poster_id, :post_time, :poster_ip, :post_username, :enable_bbcode, 
        :enable_html, :enable_smilies, :enable_sig, :post_edit_time, 
        :post_edit_count)
    """

    with open("phpbb_1posts_1.csv", mode="r") as file:
        csvFile = csv.DictReader(file, delimiter=";")
        for lines in csvFile:
            lines["post_id"] = int(lines["post_id"])
            lines["topic_id"] = int(lines["topic_id"])
            lines["forum_id"] = int(lines["forum_id"])
            lines["poster_id"] = int(lines["poster_id"])
            lines["post_time"] = int(lines["post_time"])
            # lines['poster_ip'] 'post_username'
            # lines['post_username'] = 'aaaaaaaaa'
            lines["enable_bbcode"] = bool(lines["enable_bbcode"])
            lines["enable_html"] = bool(lines["enable_html"])
            lines["enable_smilies"] = bool(lines["enable_smilies"])
            lines["enable_sig"] = bool(lines["enable_sig"])
            lines["post_edit_time"] = (
                int(lines["post_edit_time"])
                if lines["post_edit_time"]
                else None
            )
            lines["post_edit_count"] = int(lines["post_edit_count"])
            # print(lines)
            db.session.execute(text(ins1), lines)

        db.session.commit()


def insert_to_post_text():
    ins1 = """
    INSERT INTO phpbb_1posts_text 
        (post_id, bbcode_uid, post_subject, post_text)
    VALUES 
        (:post_id, :bbcode_uid, :post_subject, :post_text)
    """

    with open("phpbb_1posts_text_2.csv", mode="r") as file:
        csvFile = csv.DictReader(file, delimiter=";")

        for lines in csvFile:
            lines["post_id"] = int(lines["post_id"])
            # print(lines)
            db.session.execute(text(ins1), lines)

        db.session.commit()


with app.app_context():
    result = db.session.execute(
        text("SELECT * FROM dennikov.phpbb_1categories limit 10;")
    )
    categories = result.fetchall()

    if categories:
        cat_list = [
            f"{cat.cat_id} (ID: {cat.cat_title})" for cat in categories
        ]
        print(cat_list)

    insert_to_phpbb_1posts()
    insert_to_post_text()
