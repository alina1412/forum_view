from flask import flash, redirect, render_template, request, session, url_for, Flask


from . import db

from . import app
from .auth_ import login_required


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
    cur = db.connection.cursor()
    res = cur.execute(
        """ select count(*) from
    phpbb_1posts_text ;
    """
    )
    rv = cur.fetchall()
    print(rv, "-----------")
    return render_template("index.html")
