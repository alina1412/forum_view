import logging

from flask import (
    abort,
    render_template,
    request,
)
from sqlalchemy import text

from app_pack.text_parser import change_quotes

from . import app, db


def db_get(sql, params=None):
    res = db.session.execute(text(sql), params or {})
    return res.fetchall()


@app.route("/")
def forums_view():
    """Главная с форумами по категориям"""
    all_categories = db_get("""
                SELECT cat_id, cat_title 
                FROM dennikov.phpbb_1categories 
                ORDER BY cat_order;
                            """)

    all_cat_id = [int(cat.cat_id) for cat in all_categories]

    categs_have_forums = {}

    sql = """SELECT phpbb_1forums.forum_id, forum_name, forum_desc, 
        forum_posts as forum_posts_count, forum_topics as forum_topics_count
        FROM dennikov.phpbb_1forums
        where cat_id = :cat_id;"""

    for cat_id in all_cat_id:
        res = db_get(sql, {"cat_id": cat_id})
        categs_have_forums[cat_id] = res

    context = {
        "all_categories": all_categories,
        "categs_have_forums": categs_have_forums,
    }

    return render_template("index.html", **context)


@app.route("/topics/<forum_id>/<topic_id>")
def posts_view(forum_id, topic_id):
    """Показывает список постов в топике в форуме"""
    try:
        forum_id = int(forum_id)
        topic_id = int(topic_id)
    except ValueError as err:
        logging.error(str(err))
        abort(400)

    logging.debug(f"forum_id {forum_id}, topic_id {topic_id}")

    sql = """SELECT phpbb_1posts.post_id, phpbb_1posts.topic_id, 
    phpbb_1users.username, phpbb_1posts.poster_id,
    to_char(date(to_timestamp(post_time)),'DD-MM-YYYY') AS "time2",
                    bbcode_uid, post_subject, post_text, topic_title
        FROM dennikov.phpbb_1posts 
        left join dennikov.phpbb_1posts_text on phpbb_1posts_text.post_id = phpbb_1posts.post_id
        left join dennikov.phpbb_1topics on phpbb_1posts.topic_id = phpbb_1topics.topic_id
        left join dennikov.phpbb_1users on user_id = phpbb_1posts.poster_id
        where phpbb_1posts.topic_id = :topic_id
        order by post_time
    ;"""
    posts = db_get(sql, {"topic_id": topic_id})

    votes = {}
    SPECIAL_TOPIC_IDS = [87, 96, 100, 146, 172, 192]

    if topic_id in SPECIAL_TOPIC_IDS:
        sql = """    
        SELECT  vote_option_text, vote_result
        FROM dennikov.phpbb_1vote_desc
        left join dennikov.phpbb_1vote_results 
           on phpbb_1vote_desc.vote_id = phpbb_1vote_results.vote_id
        where topic_id = :topic_id
        ;"""
        votes = db_get(sql, {"topic_id": topic_id})

    posts = [
        {
            "post_id": post.post_id,
            "topic_id": post.topic_id,
            "username": post.username,
            "poster_id": post.poster_id,
            "time": post.time2,
            "bbcode_uid": post.bbcode_uid,
            "post_subject": post.post_subject,
            "post_text": post.post_text,
            "topic_title": post.topic_title,
        }
        for post in posts
    ]

    for i, elem in enumerate(posts):
        logging.debug(f"elem: {elem}")
        post_text = change_quotes(elem)
        posts[i]["post_text"] = post_text

    context = {
        "posts": posts,
        "title": posts[0]["topic_title"] if posts else "",
        "forum_id": forum_id,
        "topic_id": topic_id,
        "votes": votes,
    }

    return render_template("posts.html", **context)


@app.route("/topics/<forum_id>")
def topics_view(forum_id):
    """Показывает список топиков в форуме"""
    try:
        forum_id = int(forum_id)
    except ValueError as err:
        logging.error(str(err))
        abort(400)
    logging.debug(f"{forum_id} forum_id")

    sql = """SELECT forum_name, topic_id, topic_title, topic_replies
        FROM dennikov.phpbb_1topics
        left join dennikov.phpbb_1forums 
                  on phpbb_1forums.forum_id = phpbb_1topics.forum_id
        where phpbb_1topics.forum_id = :forum_id
        order by topic_id;
    """
    topics = db_get(sql, {"forum_id": forum_id})

    context = {
        "topics": topics,
        "title": topics[0].forum_name if topics else "",
        "forum_id": forum_id,
    }
    return render_template("topics.html", **context)


@app.route("/users/<user_id>/")
def users(user_id):
    """Показывает пользователей"""
    MAXUSERID = 10**8

    try:
        user_id = int(user_id)
        logging.debug(f"{user_id}")
        if user_id > MAXUSERID:
            raise ValueError
    except ValueError as err:
        logging.error(str(err))
        abort(400)

    forum_id = request.args.get("forumId")
    topic_id = request.args.get("topicId")
    return_to = {"forum_id": forum_id, "topic_id": topic_id}
    logging.debug(f"return_to: {return_to}")

    sql = """
        SELECT username, 
        to_char(date(to_timestamp(user_regdate)),'DD-MM-YYYY') as registered, 
        user_posts as user_posts_count, user_from, user_occ, user_interests
        FROM dennikov.phpbb_1users   
        where user_id = :user_id;    
    """
    user = db_get(sql, {"user_id": user_id})
    try:
        user = user[0]
    except Exception as err:
        logging.error(str(err))
        abort(404)

    logging.debug(f"user: {user}")

    context = {
        "user": user,
        "return_to": return_to,
    }
    return render_template("user.html", **context)
