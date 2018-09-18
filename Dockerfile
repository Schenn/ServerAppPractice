FROM node:8

RUN useradd --create-home --shell /bin/bash lohapp

RUN mkdir -p /home/lohapp/src/

WORKDIR /home/lohapp/src/

COPY . .

RUN apt-get update && \
    apt-get install -y openssl && \
    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ./https/key.pem -out ./https/cert.pem \
        -subj "/C=US/ST=Oregon/L=Portland/O=Schennco/OU=Development/CN=localhost"

RUN chown -R lohapp /home/lohapp/
RUN chmod 0755 /home/lohapp/

USER lohapp

EXPOSE 8080
EXPOSE 8081

CMD ["node", "/home/lohapp/src/index.js"]