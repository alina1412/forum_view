import logging
import re
from . import app


def change_quotes(post):
    post_text = post.get("post_text", "")
    if not post_text:
        post_text = ""
    logging.debug(f"post_text {post_text}")

    post_text = post_text.replace("\r\n", "<br>")
    post_text = post_text.replace("\n", "<br>")

    for elem in app.config["smilies"]:
        img = f"""<img src="/static/img/{elem.smile_url}" type="image/ico">"""
        post_text = post_text.replace(elem.code, img)

    pattern = r"""^(.*)?(\[quote:[a-z0-9\-]{10})([=]["].*["]\])(.*)?(\[\/quote:[a-z0-9\-]{10}\])(.*)?"""
    groups_ = re.match(pattern, post_text)

    if groups_:
        logging.debug(
            f"groups: {[(i, g) for i, g in enumerate(groups_.groups())]}"
        )
        d = {}
        for i, g in enumerate(groups_.groups()):
            d[i] = g

        bbcode = groups_.group(2)[7:]

        if 0:
            link = f"""<a href="#" onClick="e.preventDefault(); $("#{bbcode}")[0].scrollIntoView();";>Цитата: </a>"""
        else:
            link = "<p>Цитата: </p>"

        post_text = post_text.replace(
            d[1], """\n<div class='quote'>\n""" + link
        )
        post_text = post_text.replace(d[2], "")
        post_text = post_text.replace(d[4], """\n</div>\n""")
        logging.debug(f"processed post_text: {post_text}")

    def for_b_tag(post_text):
        pattern = r"""\[b:[a-z0-9\-]{10}\]"""
        post_text = re.sub(pattern, """\n<b>\n""", post_text)

        pattern = r"""\[\/b:[a-z0-9\-]{10}\]"""
        post_text = re.sub(pattern, """\n</b>\n""", post_text)
        return post_text

    post_text = for_b_tag(post_text)

    def for_i_tag(post_text):
        pattern = r"""\[i:[a-z0-9\-]{10}\]"""
        post_text = re.sub(pattern, """\n<i>\n""", post_text)

        pattern = r"""\[\/i:[a-z0-9\-]{10}\]"""
        post_text = re.sub(pattern, """\n</i>\n""", post_text)

        pattern = r"""\[u:[a-z0-9\-]{10}\]"""
        post_text = re.sub(pattern, """\n<i>\n""", post_text)

        pattern = r"""\[\/u:[a-z0-9\-]{10}\]"""
        post_text = re.sub(pattern, """\n</i>\n""", post_text)
        return post_text

    post_text = for_i_tag(post_text)

    return post_text
