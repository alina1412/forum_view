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

SCHEMA_NAME = "dennikov."


def insert_to_phpbb_1posts():
    ins1 = f"""
    INSERT INTO {SCHEMA_NAME}phpbb_1posts (post_id, topic_id, forum_id, 
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
    ins1 = f"""
    INSERT INTO {SCHEMA_NAME}phpbb_1posts_text 
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


def insert_to_post_topics():
    ins1 = f"""
        INSERT INTO {SCHEMA_NAME}phpbb_1topics 
        (topic_id, forum_id, topic_title, topic_poster, topic_time, topic_views, 
        topic_replies, topic_status, topic_vote, topic_type, topic_first_post_id, 
        topic_last_post_id, topic_moved_id)
        VALUES 
        (:topic_id, :forum_id, :topic_title, :topic_poster, :topic_time, :topic_views, 
        :topic_replies, :topic_status, :topic_vote, :topic_type, :topic_first_post_id, 
        :topic_last_post_id, :topic_moved_id)
    """
    int_fields = [
        "topic_id",
        "forum_id",
        "topic_poster",
        "topic_time",
        "topic_views",
        "topic_replies",
        "topic_status",
        "topic_vote",
        "topic_type",
        "topic_first_post_id",
        "topic_last_post_id",
        "topic_moved_id",
    ]

    with open("phpbb_1topics.csv", mode="r") as file:
        csvFile = csv.DictReader(file, delimiter=";")

        for lines in csvFile:
            for field in int_fields:
                lines[field] = int(lines[field])
            # print(lines)
            db.session.execute(text(ins1), lines)

        db.session.commit()


# fmt: off
def insert_to_categories():
    sql = f"""
        INSERT INTO {SCHEMA_NAME}phpbb_1categories
        (cat_id, cat_title, cat_order, cat_main_type, cat_main, 
        cat_desc) VALUES
        (1, 'АРТИСТЫ И ХУДОЖНИКИ', 10, 'c', 0, ''),
        (2, 'ЗАРЕГИСТРИРОВАННЫМ ПОЛЬЗОВАТЕЛЯМ', 90, 'c', 0, ''),
        (3, 'ДОБРО ПОЖАЛОВАТЬ В ТЕАТР КУКОЛ', 50, 'c', 0, '');
        """
    db.session.execute(text(sql))
    db.session.commit()

def insert_to_forums():
    sql = f"""
        INSERT INTO {SCHEMA_NAME}phpbb_1forums 
        (forum_id, cat_id, forum_name, forum_desc, forum_status, 
        forum_order, forum_posts, forum_topics, forum_last_post_id, prune_next, 
        prune_enable, auth_view, auth_read, auth_post, auth_reply, auth_edit, 
        auth_delete, auth_sticky, auth_announce, auth_vote, auth_pollcreate, 
        auth_attachments, forum_link, forum_link_internal, forum_link_hit_count, 
        forum_link_hit, main_type) 
        VALUES
        (1, 1, 'Ваши вопросы для Андрея Денникова', 'Пожалуйста, пишите в этот форум, если у вас есть вопросы к Андрею, если хотите поделиться своим мнением или пожелать чего-нибудь доброго... Вы также можете дополнять вопросы других участников гостиной. Спасибо!', 0, 20, 545, 90, 7635, NULL, 0, 0, 0, 1, 1, 1, 1, 5, 5, 1, 5, 0, NULL, 0, 0, 0, 'c'),
        (2, 3, 'Спектакли Театра кукол им. Образцова', 'Раздел открыт для ваших отзывов о спектаклях Андрея Денникова в Театре кукол им. Образцова. Пожалуйста, поделитесь своими впечатлениями с коллегами по форуму...', 0, 20, 285, 25, 7637, NULL, 0, 0, 0, 1, 1, 1, 1, 3, 3, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (3, 2, 'Техническая поддержка', 'Если у вас возникли технические сложности в работе с проектом Dennikov.Ru, пожалуйста, разместите здесь ваш вопрос, а мы постараемся ответить на него как можно скорее.', 0, 140, 54, 14, 7237, NULL, 0, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (4, 2, 'Культура и искусство', 'Если вы увлечены театром, хотите обсудить последние события в мире культуры,  готовы поделиться впечатлениями от выставки, концерта, художественного фильма или книги, добро пожаловать...', 0, 110, 506, 18, 7535, NULL, 0, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (5, 2, 'Знакомство с участниками гостиной', 'Общение по интересам в рамках действующих на форуме правил: ведение дискуссионных тем, которые помогают лучше узнать друг друга...', 0, 100, 651, 23, 7625, NULL, 0, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (6, 3, 'Заказ билетов через форум', 'Вы можете забронировать любые билеты на спектакли Андрея Денникова через форум. Просто отправьте e-mail пользователю Заказ Билетов, указав номер контактного телефона, и в ближайшее время с вами свяжется сотрудник театра. Спасибо!', 0, 40, 2, 1, 312, NULL, 0, 0, 0, 5, 5, 1, 1, 3, 3, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (7, 1, 'Ваши вопросы к артистам Театра кукол', 'Уважаемые коллеги, познакомиться с Еленой Поваровой, Ириной Яковлевой, Ириной Осинцовой, Ольгой Балашовой, Максимом Мишаевым, Романом Богатовым, оставить свой отзыв об их работе и задать интересующие вас вопросы можно в специальном разделе. Добрые пожелания, как всегда, имеют преимущество!', 0, 30, 288, 37, 7632, NULL, 0, 0, 0, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (8, 3, 'Концерт для Чичикова с оркестром', 'В отдельной группе собраны темы, посвящённые премьере сезона 2005/06, спектаклю по мотивам поэмы Николая Гоголя \"Мёртвые души\". Приглашаем вас поделиться впечатлениями!', 0, 30, 226, 8, 7617, NULL, 0, 0, 0, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (9, 1, 'Мастер-класс художников Театра кукол', 'Сценография, костюм, кукла. Благодаря Анне Львовой и Татьяне Рева у нас есть возможность узнать всё самое интересное о работе над художественным образом спектакля. Размещайте, пожалуйста, ваши вопросы здесь.', 0, 40, 89, 12, 7517, NULL, 0, 0, 0, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (12, 2, 'Игры на форуме', 'Открывая новую игру, сопроводите её, пожалуйста, строгим предписанием: по каким правилам игра ведётся, каковы порядок и форма участия.', 0, 120, 925, 10, 7497, NULL, 0, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (13, 2, 'Поздравления к праздникам', 'Красные дни календаря, всенародные праздники, дни рождения и круглые даты отмечаем в этой секции.', 0, 130, 155, 13, 7384, NULL, 0, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, 'c'),
        (14, 3, 'Женитьба Фигаро: премьера в Марселе 23 марта 2007 г.', 'Весенняя премьера нового сезона 2006/07 уже назначена...', 0, 10, 1, 1, 7506, NULL, 0, 0, 0, 1, 1, 1, 1, 5, 5, 1, 1, 0, NULL, 0, 0, 0, NULL);
"""     # noqa 
    # fmt: on
    db.session.execute(text(sql))
    db.session.commit()

def insert_vote_desc_from_csv(csv_file):
    """
    Read data from vote_desc.csv and insert into phpbb_1vote_desc table
    """
    query = f"""
        INSERT INTO {SCHEMA_NAME}phpbb_1vote_desc 
            (vote_id, topic_id, vote_text, vote_start, vote_length)
        VALUES 
            (:vote_id, :topic_id, :vote_text, :vote_start, :vote_length)
    """

    with open(csv_file, mode="r", encoding='utf-8') as file:
        csvFile = csv.DictReader(file, delimiter=";")

        for row in csvFile:
            row["vote_id"] = int(row["vote_id"])
            row["topic_id"] = int(row["topic_id"])
            row["vote_start"] = int(row["vote_start"])
            row["vote_length"] = int(row["vote_length"])
       
            db.session.execute(text(query), row)
           
        db.session.commit()

    print(f"Inserted into phpbb_1vote_desc")


def insert_vote_results_from_csv(csv_file):
    """
    Read data from vote_results.csv and insert into phpbb_1vote_results table
    """
    query = f"""
        INSERT INTO {SCHEMA_NAME}phpbb_1vote_results 
            (vote_id, vote_option_id, vote_option_text, vote_result)
        VALUES 
            (:vote_id, :vote_option_id, :vote_option_text, :vote_result)
    """


    with open(csv_file, mode="r", encoding='utf-8') as file:
        csvFile = csv.DictReader(file, delimiter=";")

        for row in csvFile:
            row["vote_id"] = int(row["vote_id"])
            row["vote_option_id"] = int(row["vote_option_id"])
            row["vote_result"] = int(row["vote_result"])
            # vote_option_text remains as string

            db.session.execute(text(query), row)
           
        db.session.commit()
     
    print(f"Inserted into phpbb_1vote_results")


def insert_vote_voters_from_csv(csv_file):
    """
    Read data from vote_voters.csv and insert into phpbb_1vote_voters table
    """
    query = f"""
        INSERT INTO {SCHEMA_NAME}phpbb_1vote_voters 
            (vote_id, vote_user_id, vote_user_ip)
        VALUES 
            (:vote_id, :vote_user_id, :vote_user_ip)
    """


    with open(csv_file, mode="r", encoding='utf-8') as file:
        csvFile = csv.DictReader(file, delimiter=";")
        count = 0

        for row in csvFile:
            # Convert integer fields
            row["vote_id"] = int(row["vote_id"])
            row["vote_user_id"] = int(row["vote_user_id"])
            # vote_user_ip remains as string (bpchar)

            db.session.execute(text(query), row)
           
        db.session.commit()

    print(f"Inserted into phpbb_1vote_voters")


with app.app_context():
    result = db.session.execute(
        text(f"SELECT * FROM {SCHEMA_NAME}phpbb_1categories limit 10;")
    )
    categories = result.fetchall()

    if categories:
        cat_list = [
            f"{cat.cat_id} (ID: {cat.cat_title})" for cat in categories
        ]
        # print(cat_list)

    insert_to_categories()
    insert_to_phpbb_1posts()
    insert_to_post_text()
    insert_to_forums()
    insert_to_post_topics()
    insert_vote_desc_from_csv("vote_desc.csv")
    insert_vote_results_from_csv("vote_results.csv")
    # insert_vote_voters_from_csv("vote_voters.csv")
    print("done")
