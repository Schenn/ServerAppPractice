FROM node:12

RUN useradd --create-home --shell /bin/bash app

RUN mkdir -p /app/src/

WORKDIR /app/src/

COPY ./index.js ./
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./build.js ./


RUN chown -R app /app/
RUN chmod 0755 /app/

USER app

RUN npm install