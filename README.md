# Burger Queen - API con Node.js
![Frame 8](https://user-images.githubusercontent.com/58056552/89217742-49e66980-d592-11ea-9f9d-a08846777529.png) 

API sevidor web con Node.js desarrollado junto con una serie de herramientas comunes usadas en este tipo de contexto: **Express** como
framework, **MongoDB** como base datos, contenedores de **docker** y servidores
virtuales como **EC2**.

## Índice

* [Endpoints](#api-endpoints)
* [CLI](#cli)
* [Deployment](#deployment)
* [Objetivos de aprendizaje](#objetivos-de-aprendizaje)

## API Endpoints
[Documentación guía de la clienta](https://laboratoria.github.io/burger-queen-api/)

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

La aplicación cuente un comando **`npm start`**
que se encarga de ejecutar la aplicación node y además puede
recibir información de configuración, como el puerto en el que escuchar, a qué
base datos conectarse, etc. Estos datos de configuración son distintos entre
diferentes entornos (desarrollo, producción, ...).

```sh
# Arranca la aplicación el puerto 8888 usando npm
npm start 8888
```
La aplicación usa las siguientes **variables de entorno**:

* `PORT`: Si no se ha especificado un puerto como argumento de lína de comando,
  se puede usar la variable de entorno `PORT` para especificar el puerto. Valor
  por defecto `8080`.
* `DB_URL`: El _string_ de conexión de _MongoDB_. En entorno de desarrollo se
  utilizó una base de datos local, pero en producción se utilizan las instancias
  configuradas con `docker-compose`.
* `JWT_SECRET`: La aplicación implementa autenticación usando JWT (JSON
   Web Tokens). Para poder firmar (cifrar) y verificar (descifrar) los tokens.
* `ADMIN_EMAIL`: Opcionalmente se puede especificar un email y password para
  el usuario admin (root). Si estos detalles están presentes la aplicación se
  asegurará que exista el usuario y que tenga permisos de administrador. Valor
  por defecto `admin@localhost`.
* `ADMIN_PASSWORD`: Si hemos especificado un `ADMIN_EMAIL`, debemos pasar
  también una contraseña para el usuario admin. Valor por defecto: `changeme`.

## Deployment

La aplicación esta configurada con `docker-compose`, desplegada en la nube (VPS) con los servicios **EC2** de AWS quedando online y accesibles.

## Objetivos de aprendizaje
### Node

* [x] Instalar y usar modules
* [x] `npm scripts`

### Express

* [x] Rutas
* [x] `middlewares`

### HTTP

* [x] Request
* [x] Response
* [x] Headers
* [x] Body
* [x] Verbos HTTP
* [x] Codigos de status de HTTP
* [x] Encodings y `JSON`
* [ ] CORS

### Autenticación

* [x] `JWT`
* [x] Cómo guardar y validar contraseñas

### Testing

* [x] Tests de integración
* [x] Tests unitarios

### Frontend Development

* [x] Variables de entorno
* [x] `SSH`
* [x] `SSH` keys
* [x] Qué es un VPS

### MongoDB o MySQL (según corresponda)

* [x] Instalación
* [x] Conexión a través de cliente
* [x] Connection string
* [x] Comandos/Queries de creacion, lectura, modificación y eliminación

### Deployment

* [x] Contenedores
* [x] Qué es Docker
* [x] Qué es Docker compose
* [x] Uso de `docker-compose`

### Colaboración y Organización con Git y Github

* [x] Forks
* [x] Branches
* [x] Pull Requests
* [ ] Tags
* [x] Projects
* [x] Issues
* [x] Labels
* [x] Milestones

### Buenas prácticas de desarrollo

* [x] Modularización
* [x] Nomenclatura / Semántica
* [x] Linting
