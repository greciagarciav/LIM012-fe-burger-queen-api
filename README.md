# Burger Queen - API with Node.js
![Frame 8](https://user-images.githubusercontent.com/58056552/89217742-49e66980-d592-11ea-9f9d-a08846777529.png) 

API built with Node.js, **Express** as the framework, **MongoDB** as the database, **Docker** for the containers and services
like **EC2**

## Índice

* [Local Set Up](#local-set-up)
* [Endpoints](#api-endpoints)
* [CLI](#cli)
* [Deployment](#deployment)
* [Learning goals](#learning-goals)

## Local Set Up
[Mongo db installation guide](https://zellwk.com/blog/install-mongodb/) <br/>
[Mongo db local connection guide](https://zellwk.com/blog/local-mongodb/) <br/>
Install mongodb with brew
```
brew tap mongodb/brew
brew install mongodb-community
```
You need to create a /data/db folder in System/Volumes/Data.
```
sudo mkdir -p /System/Volumes/Data/data/db
sudo chown -R `id -un` /System/Volumes/Data/data/db
```
Run the service
```
brew services run mongodb-community
```
Access the Mongo shell
```
mongo
```

See the currently selected database with the db command

```
db
```

create a database called burger-queen. Use the 'use' command to create and switch to a new database.
```
use burger-queen
```

Access MongoDB with MongoDB Compass <br/>
To connect to your local MongoDB, set Hostname to localhost and Port to 27017. <br/>
These values are the default for all local MongoDB connections (unless you changed them).

Finally run
```
npm i
npm start
```

Sign with the admin user to start playing with the API.

## API Endpoints
[Client Doc](https://laboratoria.github.io/burger-queen-api/)

### `/`

* `GET /`

### `/auth`

* `POST /auth`

### `/users`

* `GET /users`
* `GET /users/:uid`
* `POST /users`
* `PUT /users/:uid`
* `DELETE /users/:uid`

### `/products`

* `GET /products`
* `GET /products/:productid`
* `POST /products`
* `PUT /products/:productid`
* `DELETE /products/:productid`

### `/orders`

* `GET /orders`
* `GET /orders/:orderId`
* `POST /orders`
* `PUT /orders/:orderId`
* `DELETE /orders/:orderId`

## CLI

Start the app
```sh
npm start 8888
```
**ENVS**:

* `PORT`: default value `8080`.
* `DB_URL`: MongoDB conextion string.
* `JWT_SECRET`: For authentication (JSON Web Tokens). To sign and verify tokens.
* `ADMIN_EMAIL`: default value `admin@localhost`.
* `ADMIN_PASSWORD`: deafult value `changeme`.

## Deployment

Configure with `docker-compose` and deploy (VPS) with **EC2**.

## Learning Goals
### Node

* [x] Install and use modules
* [x] `npm scripts`

### Express

* [x] Routes
* [x] `middlewares`

### HTTP

* [x] Request
* [x] Response
* [x] Headers
* [x] Body
* [x] HTTP Verbs
* [x] HTTP status codes
* [x] Encodings and `JSON`
* [ ] CORS

### Autenticación

* [x] `JWT`
* [x] How to save and validate passwords

### Testing

* [x] Integration tests
* [x] Unit Tests

### Frontend Development

* [x] Environment variables
* [x] `SSH`
* [x] `SSH` keys
* [x] VPS

### MongoDB

* [x] Installation
* [x] Connection with client
* [x] Connection string
* [x] Commands/Queries CRUD

### Deployment

* [x] Containers
* [x] Docker
* [x] Docker compose
* [x] `docker-compose` usage

### Organization and Collaboration with Git and Github

* [x] Forks
* [x] Branches
* [x] Pull Requests
* [ ] Tags
* [x] Projects
* [x] Issues
* [x] Labels
* [x] Milestones

### Good Practices

* [x] Modules
* [x] Naming and coding conventions
* [x] Linting
