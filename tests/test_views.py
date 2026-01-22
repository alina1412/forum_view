def test_main_view(client, captured_templates):
    response = client.get("/")

    assert len(captured_templates) == 1

    template, context = captured_templates[0]

    assert template.name == "index.html"
    for key in (
        "all_categories",
        "categs_have_forums",
    ):
        assert key in context


def test_topics_view(client, captured_templates):
    response = client.get("/topics/1")

    assert len(captured_templates) == 1

    template, context = captured_templates[0]

    assert template.name == "topics.html"
    for key in (
        "topics",
        "title",
        "forum_id",
    ):
        assert key in context


def test_posts_view(client, captured_templates):
    response = client.get("/topics/1/10")

    assert len(captured_templates) == 1

    template, context = captured_templates[0]

    assert template.name == "posts.html"
    for key in (
        "posts",
        "title",
        "forum_id",
        "topic_id",
        "votes",
    ):
        assert key in context
