import pytest
from flask import Flask, template_rendered

from app import app as app0


@pytest.fixture
def app() -> Flask:
    app0.config.update({"TESTING": True})
    yield app0


@pytest.fixture
def app_context(app):
    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client


@pytest.fixture
def captured_templates(app_context):
    recorded = []

    def record(sender, template, context, **extra):
        recorded.append((template, context))

    template_rendered.connect(record, app_context)
    try:
        yield recorded
    finally:
        template_rendered.disconnect(record, app_context)
