from python:3.8-alpine

run mkdir /app
WORKDIR app
RUN mkdir log
COPY requirements.txt /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

    # install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

RUN pip3 install -r /app/requirements.txt --no-cache-dir
COPY . .
EXPOSE 8000
