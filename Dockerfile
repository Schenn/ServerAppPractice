FROM node:10

RUN useradd --create-home --shell /bin/bash app

RUN mkdir -p /app/src/

WORKDIR /app/src/

COPY . .

RUN apt-get update && \
    apt-get install -y apt-utils && \
    apt-get install -y openssl && \
    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ./https/key.pem -out ./https/cert.pem \
        -subj "/C=US/ST=Oregon/L=Portland/O=Schennco/OU=Development/CN=localhost"

RUN chown -R app /app/
RUN chmod 0755 /app/

USER app

CMD ["node", "./index.js"]
