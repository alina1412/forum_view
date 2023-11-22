from flask import flash, redirect, render_template, request, session, url_for
from functools import wraps
from . import app

# from .user_manager import UserManager


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if "logged_in" in session and session["logged_in"]:
            return f(*args, **kwargs)
        else:
            flash("You need to login first")
            return redirect(url_for("login"))

    return wrap


@app.route("/logout")
def logout():
    session["logged_in"] = False
    session["email"] = False
    flash("you were logged out")
    return redirect(url_for("login"))


@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        print(email, password)
        # ret = UserManager().register_user(email, password)
        # if ret == "success":
        #     flash("register successfully!")
        #     return redirect('/login')
        # else:
        #     flash(ret)
        #     return render_template("register.html", error="")
    else:
        if "logged_in" in session and session["logged_in"]:
            session["logged_in"] = False
        return render_template("register.html", error="")


"""
@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        # Debug mode "a@1.ru"
        if email == "a@1.ru" and password == "qwert":
            session["logged_in"] = True
            session["email"] = "books"
            return redirect('/hello')
        else:
            if UserManager().is_log_in(email, password):
                session["logged_in"] = True
                session["email"] = email
                return redirect('/hello')
            else:
                flash("pair login/ password - incorrect!")
                return render_template("login.html", error="")
    else:
        if "logged_in" in session and session["logged_in"]:
            return redirect('/hello')
        return render_template("login.html", error="")
"""
