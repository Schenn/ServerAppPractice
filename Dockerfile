FROM node:8

RUN useradd --create-home --shell /bin/bash lohapp

RUN mkdir -p /home/lohapp/src/
RUN chown -R lohapp /home/lohapp/
RUN chmod 0755 /home/lohapp/

RUN apt-get update && \
    apt-get install -y openssl && \
    openssl genrsa -des3 -passout pass:x -out server.pass.key 2048 && \
    openssl rsa -passin pass:x -in server.pass.key -out server.key && \
    rm server.pass.key && \
    openssl req -new -key server.key -out server.csr \
        -subj "/C=US/ST=Oregon/L=Portland/O=Schennco/OU=Development/CN=localhost" && \
    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

USER lohapp

WORKDIR /home/lohapp/src/

COPY . .

EXPOSE 8080

CMD ["node", "/home/lohapp/src/index.js"]