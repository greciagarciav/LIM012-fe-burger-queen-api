# OBJETIVOS DE APRENDIZAJES
### Node

* [ ] Instalar y usar modules
* [ ] `npm scripts`

### Express

* [ ] Rutas
* [ ] `middlewares`

### HTTP

* [ ] Request
* [ ] Response
* [ ] Headers
* [ ] Body
* [ ] Verbos HTTP
* [ ] Codigos de status de HTTP
* [ ] Encodings y `JSON`
* [ ] CORS

### Autenticación

* [ ] `JWT`
* [ ] Cómo guardar y validar contraseñas

### Testing

* [ ] Tests de integración
* [ ] Tests unitarios

### Frontend Development

* [ ] Variables de entorno
* [ ] `SSH`
* [ ] `SSH` keys
* [ ] Qué es un VPS

### MongoDB o MySQL (según corresponda)

* [ ] Instalación
* [ ] Conexión a través de cliente
* [ ] Connection string
* [ ] Comandos/Queries de creacion, lectura, modificación y eliminación

### Deployment

* [ ] Contenedores
* [ ] Qué es Docker
* [ ] Qué es Docker compose
* [ ] Uso de `docker-compose`

### Colaboración y Organización con Git y Github

* [ ] Forks
* [ ] Branches
* [ ] Pull Requests
* [ ] Tags
* [ ] Projects
* [ ] Issues
* [ ] Labels
* [ ] Milestones

### Buenas prácticas de desarrollo

* [ ] Modularización
* [ ] Nomenclatura / Semántica
* [ ] Linting
### EXPRESS
#### ROUTES
> Son caminos que el usuario toma, que vienen adjuntos con un codigo que será ejecutado cuando el usuario llegue a una ruta en específico. Hace referencia a la determinación de cómo responde una aplicación a una solicitud de cliente en un determinado punto final, que es un URI (o una vía de acceso) y un método de solicitud HTTP específico.
#### MIDDLEWARES
> funciones que tienen acceso al objeto de solicitud (req) y de respuesta (res) y a la siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación. La siguiente función de middleware se denota normalmente con una variable denominada next. <br>
Pueden realizar lo siguiente:
>> * Ejecutar cualquier código.
>> * Realizar cambios en la solicitud y los objetos de respuesta.
>> * Finalizar el ciclo de solicitud/respuestas.
>> * Invocar el siguiente middleware en la pila. <br>
>>
> Si la función de middleware actual no finaliza el ciclo de solicitud/respuestas, debe invocar next() para pasar el control a la siguiente función de middleware. De lo contrario, la solicitud quedará colgada.
>
### HTTP
#### REQUEST
> Objeto que contiene información sobre la solicitud HTTP
#### RESPONSE
> La respuesta a devolver al navegador del cliente.
#### HEADERS
> Las cabeceras permiten al cliente y al servidor enviar información adicional junto a una petición o respuesta. 
#### BODY
> Datos transmitidos en un mensaje de transacción HTTP.
#### VERBOS
##### GET
> solicita una representación de un recurso específico. Estas peticiones sólo deben recuperar datos.
##### POST
> se utiliza para enviar una entidad a un recurso en específico.
##### PUT
> Reemplaza todas las representaciones actuales del recurso de destino con la carga útil de la petición.
##### DELETE
> Borra un recurso en específico.
#### CÓDIGOS DE STATUS
> [Status Code](https://httpstatuses.com)
#### ENCONDINGS
> La cabecera Content-Encoding es usada para comprimir el media-type. Cuando está presente, su valor indica qué codificación de contenido adicional ha sido aplicada al cuerpo de la entidad. Permite al cliente saber cómo decodificar para obtener el media-type referido por la cabecera Content-Type.
#### JSON
> Formato de texto sencillo para el intercambio de datos.
#### CORS
> Intercambio de recursos de origen cruzado (Cross-origin resource sharing).
Es un mecanismo que utiliza cabeceras HTTP adicionales para permitir que un user agent obtenga permiso para acceder a recursos seleccionados desde un servidor, en un origen distinto (dominio) al que pertenece.
#### PAGINACIÓN
> Cuando el numero de resultados de una consulta es grande, es necesario dividirlo,
para que la eficiencia (tiempo de carga) y la experiencia de usuario no se negativa.