FROM alpine
RUN apk add --update nodejs npm
COPY . /src
WORKDIR /src
EXPOSE 8080
ENTRYPOINT [ "node", "./app.js" ]
