import re
from flask import flash, redirect, render_template, request, session, url_for, Flask

from . import db, app



def db_get(sql):
    cur = db.connection.cursor()
    res = cur.execute(sql)
    return cur.fetchall()


@app.route("/", methods=["GET"])
def forums():
    """главная с форумами по категориям"""
    sql = """ select cat_id, cat_title 
        from phpbb_1categories order by cat_order;
        """
    all_categories = db_get(sql)
    d2 = [(res["cat_id"], res["cat_title"]) for res in all_categories]
    all_cat_id = [int(x[0]) for x in d2]
    # print(all_categories)
    # all_em = []
    # for elem in app.config["smilies"]:
    #     aaa = {'title': elem['smile_url'], 'code': elem['code']}
    #     # img = f'''<img src="/static/img/{elem['smile_url']}" type="image/ico" alt="{elem['code']}">'''
    #     all_em.append(aaa)

    categs_have_forums = {}

    sql = """select phpbb_1forums.forum_id, forum_name, forum_desc, 
        forum_posts as forum_posts_count, forum_topics as forum_topics_count
        from phpbb_1forums
        where cat_id = {};"""

    for cat_id in all_cat_id:
        res = db_get(sql.format(cat_id))
        """forum_ids_in_cat = [x["forum_id"] for x in res]"""
        # print(forum_ids_in_cat)
        categs_have_forums[cat_id] = res

    # sql = '''
    #     select topic_id, topic_title
    #     from phpbb_1topics
    #     where phpbb_1topics.forum_id = {}
    #     order by topic_id        ;
    # '''
    # topics = db_get(sql.format(forum_id))
    # forums_have_topics = {}
    # for forum_id in forum_ids_in_cat:
    #     topics = db_get(sql.format(forum_id))
    #     forums_have_topics[forum_id] = topics # {'topic_id': 70, 'topic_title': ' ddd'}
    # print(forums_have_topics)

    context = {
        "all_categories": all_categories,
        "categs_have_forums": categs_have_forums,
        # 'all_em': all_em
    }
    # print("-----------")
    return render_template("index.html", **context)


@app.route("/topics/<forum_id>/<topic_id>")
def posts(forum_id, topic_id):
    """Показывает список постов в топике в форуме"""
    # request.args.get('listOfObjects')
    try:
        forum_id = int(forum_id)
        topic_id = int(topic_id)
    except ValueError as err:
        print(str(err))
        return
    print(forum_id, topic_id, "------")
    sql = f"""select phpbb_1posts.post_id, phpbb_1posts.topic_id, phpbb_1users.username, phpbb_1posts.poster_id,
                    FROM_UNIXTIME(post_time, '%d-%m-%Y %H:%i:%s') AS 'time',
                    bbcode_uid, post_subject, post_text, topic_title
        from phpbb_1posts 
        left join phpbb_1posts_text on phpbb_1posts_text.post_id = phpbb_1posts.post_id
        left join phpbb_1topics on phpbb_1posts.topic_id = phpbb_1topics.topic_id
        left join phpbb_1users on user_id = phpbb_1posts.poster_id
        where phpbb_1posts.topic_id = {topic_id}
        order by post_time
    ;"""
    posts = db_get(sql)

    votes = {}
    if topic_id in [87, 96, 100, 146, 172, 192]:
        sql = f"""    
        select  vote_option_text, vote_result
        from phpbb_1vote_desc
        left join phpbb_1vote_results on phpbb_1vote_desc.vote_id = phpbb_1vote_results.vote_id
        where topic_id = {topic_id}
        ;"""
        votes = db_get(sql)

    def change_quotes(post):
        
        post_text = post['post_text']
        post_text = post_text.replace('\r\n', '<br>')
        post_text = post_text.replace('\n', '<br>')
        for elem in app.config["smilies"]:
            img = f'''<img src="/static/img/{elem['smile_url']}" type="image/ico">'''
            post_text = post_text.replace(elem['code'], img)

        # print()
        pattern = r'''^(.*)?(\[quote:[a-z0-9\-]{10})([=]["].*["]\])(.*)?(\[\/quote:[a-z0-9\-]{10}\])(.*)?'''
        groups_ = re.match(pattern, post_text)
        if groups_:
            print([(i, g) for i, g in enumerate(groups_.groups())])
            d = {}
            for i, g in enumerate(groups_.groups()):
                d[i] = g
                # print(i, " ", g)

            # print()
            bbcode = groups_.group(2)[7:]

            if 0:
                link = f'''<a href="#" onClick="e.preventDefault(); $("#{bbcode}")[0].scrollIntoView();";>Цитата: </a>'''
            else:
                link = '<p>Цитата: </p>'
            
            post_text = post_text.replace(d[1], '''\n<div class='quote'>\n''' + link)
            post_text = post_text.replace(d[2], '')
            post_text = post_text.replace(d[4], '''\n</div>\n''')
            print(post_text)

        def for_b_tag(post_text):
            pattern = r'''\[b:[a-z0-9\-]{10}\]'''
            post_text = re.sub(pattern, '''\n<b>\n''', post_text)
            
            pattern = r'''\[\/b:[a-z0-9\-]{10}\]'''
            post_text = re.sub(pattern, '''\n</b>\n''', post_text)
            return post_text
        
        post_text = for_b_tag(post_text)

        def for_i_tag(post_text):
            pattern = r'''\[i:[a-z0-9\-]{10}\]'''
            post_text = re.sub(pattern, '''\n<i>\n''', post_text)
            
            pattern = r'''\[\/i:[a-z0-9\-]{10}\]'''
            post_text = re.sub(pattern, '''\n</i>\n''', post_text)

            pattern = r'''\[u:[a-z0-9\-]{10}\]'''
            post_text = re.sub(pattern, '''\n<i>\n''', post_text)
            
            pattern = r'''\[\/u:[a-z0-9\-]{10}\]'''
            post_text = re.sub(pattern, '''\n</i>\n''', post_text)
            return post_text
        
        post_text = for_i_tag(post_text)
        
        return post_text
    # print(groups_.group(1), groups_.group(5), groups_.group(8)) # inds 0, 4, 7 (1, 2, 3, 5, 6)
    
    for i, elem in enumerate(posts):
        post_text = change_quotes(elem)
        posts[i]['post_text'] = post_text

    context = {
        "posts": posts,
        "title": posts[0]["topic_title"],
        "forum_id": forum_id,
        "topic_id": topic_id,
        "votes": votes,
    }
    # print("-----------", context['posts'][0], context['title'])
    return render_template("posts.html", **context)


@app.route("/topics/<forum_id>")
def topics(forum_id):
    """показывает список топиков в форуме"""
    # request.args.get('listOfObjects')
    try:
        forum_id = int(forum_id)
    except ValueError as err:
        print(str(err))
        return
    print(forum_id, "forum_id------")
    sql = f"""select forum_name, topic_id, topic_title, topic_replies
        from phpbb_1topics
        left join phpbb_1forums on phpbb_1forums.forum_id = phpbb_1topics.forum_id
        where phpbb_1topics.forum_id = {forum_id}
        order by topic_id;
    """
    topics = db_get(sql)

    context = {
        "topics": topics,
        "title": topics[0]["forum_name"],
        "forum_id": forum_id,
    }
    # print("-----------", context['topics'][0], context['title'])
    return render_template("topics.html", **context)


@app.route("/users/<user_id>/")
def users(user_id):
    """Показывает user"""
    try:
        user_id = int(user_id)
        print(user_id, '---')
        if user_id > 10**8:
            raise ValueError
    except ValueError as err:
        print(str(err))
        return
    forum_id = request.args.get('forumId')
    topic_id = request.args.get('topicId')
    return_to = {'forum_id': forum_id, 'topic_id': topic_id}

    print(return_to, 'return_to-----')
    sql = f'''
        select username, from_unixtime(user_regdate,'%d-%m-%Y') as registered, user_posts as user_posts_count, user_from, user_occ, user_interests
        from phpbb_1users   
        where user_id = {user_id};    
    '''
    user = db_get(sql)
    try:
        user = user[0]
    except Exception as err:
        print(str(err))
        return
    print(user)
    context = {
        "user": user,
        'return_to': return_to
        # "title": topics[0]["forum_name"],
        # "forum_id": forum_id,
    }
    # print("-----------", context['topics'][0], context['title'])
    return render_template("user.html", **context)


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
