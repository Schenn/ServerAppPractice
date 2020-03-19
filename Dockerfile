FROM node:10

RUN useradd --create-home --shell /bin/bash app

RUN mkdir -p /app/src/

WORKDIR /app/src/

COPY . .

RUN chown -R app /app/
RUN chmod 0755 /app/

USER app