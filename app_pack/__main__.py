from . import app
from .views import *
from waitress import serve


if __name__ == "__main__":
    # app.run(port=8082)
    # uvicorn.run("app_pack.__main__:app", host="0.0.0.0", port=8082, reload=True)
    serve(app, host="0.0.0.0", port=8082)
