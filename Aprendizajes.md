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
### API
> Las APIs permiten que las aplicaciones se comuniquen y puedan aprovechar desarrollos ya construidos en lugar de tener que crearlos desde cero. Son interfaces que permiten la comunicación entre dos aplicaciones de software siguiendo cierto conjunto de reglas. REST (Representational State Transfer) es una Arquitectura de Software.
### SERVIDOR WEB
> Un servidor web o servidor HTTP es un programa informático que procesa una aplicación del lado del servidor, realizando conexiones con el cliente y generando o cediendo una respuesta en cualquier lenguaje o aplicación del lado del cliente. El código recibido por el cliente es renderizado por un navegador web.. Generalmente se usa el protocolo HTTP para estas comunicaciones.
### EXPRESS
#### ROUTES
> Son caminos que el usuario toma, que vienen adjuntos con un codigo que será ejecutado cuando el usuario llegue a una ruta en específico. Hace referencia a la determinación de cómo responde una aplicación a una solicitud de cliente en un determinado punto final, que es un URI (o una vía de acceso) y un método de solicitud HTTP específico.
#### MIDDLEWARES
> funciones que tienen acceso al objeto de solicitud (req) y de respuesta (res) y a la siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación. La siguiente función de middleware se denota normalmente con una variable denominada next. <br>
Pueden realizar lo siguiente:
 * Ejecutar cualquier código.
 * Realizar cambios en la solicitud y los objetos de respuesta.
 * Finalizar el ciclo de solicitud/respuestas.
 * Invocar el siguiente middleware en la pila. <br>
> Si la función de middleware actual no finaliza el ciclo de solicitud/respuestas, debe invocar next() para pasar el control a la siguiente función de middleware. De lo contrario, la solicitud quedará colgada.
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
##### <span style="color: green">GET<span/>
> solicita una representación de un recurso específico. Estas peticiones sólo deben recuperar datos.
##### <span style="color: orange">POST<span/>
> se utiliza para enviar una entidad a un recurso en específico.
##### <span style="color: blue">PUT<span/>
> Reemplaza todas las representaciones actuales del recurso de destino con la carga útil de la petición.
##### <span style="color: red">DELETE<span/>
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
### AUTENTICACIÓN
#### JWT
> JSON Web Token es un estándar abierto basado en JSON para la creación de tokens de acceso que permiten la propagación de identidad y privilegios o claims. Por ejemplo, un servidor podría generar un token indicando que el usuario tiene privilegios de administrador y proporcionarlo a un cliente, entonces podría utilizar el token para probar que está actuando como un administrador en el cliente o en otro sistema.  El token está firmado por la clave del servidor, así que el cliente y el servidor son ambos capaz de verificar que el token es - legítimo. Consiste en 3 partes: Header, Payload y Signature.
### FRONTEND DEVELOPMET
#### VARIABLES DE ENTORNO
> Variables que pueden afectar al comportamiento de los procesos en ejecución en un ordenador.
Son parte del entorno en el que se ejecuta un proceso. Independientemente del sistema operativo que estemos usando, son la forma simple de pasar información de una aplicación a otra. El valor que contienen puede variar, por lo tanto puede ser alterado por el usuario, por aplicaciones, o scripts. Esta claro que si se permite modificar su contenido, también se puede crear y eliminar dependiendo de las necesidades.
> La propiedad process.env devuelve un objeto que contiene el entorno del usuario.
#### SSH
> Protocolo para una comunicacion segura. Secure Shell, es un protocolo de red que permite el acceso a un servidor por acceso remoto a través de una conexión segura, permitiendo a un usuario realizar toda clase de tareas sobre el mismo. <br> Una conexión SSH requiere de 3 apartados: <br>
Usuario <br>
Puerto <br>
Servidor <br>
Esta conexión va cifrada de manera bidireccional, así que para se logre esta conexión SSH, el servidor SSH y el cliente se deben autenticar mutuamente. <br> El cliente debe introducir el usuario, puerto y servidor al que desea acceder. Una vez hecho, el servidor emite una autenticación solicitando al cliente una contraseña que le permita el acceso al servidor. <br> Una vez que el cliente introduce la contraseña, este ya se puede acceder de forma totalmente segura. La comunicación que haya a partir de ese momento esta completamente encriptada.
#### SSH Keys
> Una clave SSH es uno de los dos archivos utilizados en un método de autenticación conocido como autenticación de clave pública SSH. En este método de autenticación, un archivo (conocido como la clave privada) generalmente se mantiene en el lado del cliente y el otro archivo (conocido como la clave pública) se almacena en el lado del servidor.
#### DNS 
> Domain Name System (DNS) es el libro de telefonos para el Internet. accedemos a informacion online a travez de los nombres de los dominios. Los navegadores webs interactuan a traves del protocolo de internet (IP) de direcciones. DNS traduce los nombres de los dominios a la direccion IP para que los navegadores puedan cargar los recursos del internet. Cada dispositivo conectado al internet tiene una direccion IP unica que otras maquinas usan para encontrarlo. Los servidores DNS eliminan la necesidad de memorizar esas direcciones IP como 192.168.1.1 (in IPv4), o otros mucho mas complejos como 2400:cb00:2048:1::c629:d7a2 (in IPv6).
#### VPS
> Un servidor virtual privado (virtual private server) es un método de particionar un servidor físico en varios servidores virtuales (máquinas virtuales con tareas de servidor) de tal forma que todo funcione como si se estuviese ejecutando en una única máquina. Cada servidor virtual es capaz de funcionar bajo su propio sistema operativo y además cada servidor puede ser reiniciado de forma independiente.
##### EC2
> Es un servidor virtual en la nube de AWS. Se, puede instalar y configurar el sistema operativo y las aplicaciones que se ejecutan en la instancia.
### DEPLOYMENT
#### CONTENEDORES
> Los contenedores de software son un paquete de elementos que permiten ejecutar una aplicación determinada en cualquier sistema operativo. Se utilizan para garantizar que una determinada aplicación se ejecute correctamente cuando cambie su entorno.
#### DOCKER
> Docker es un proyecto de código abierto que automatiza el despliegue de aplicaciones dentro de contenedores de software, proporcionando una capa adicional de abstracción y automatización de virtualización de aplicaciones en múltiples sistemas operativo.
##### DOCKER-COMPOSE
> herramineta para definir y correr aplicaciones docker multicontenedores, con el archivo yml se configura los servicios de la app. Con un simple comando se crea e inicia todos los servicios de la configuracion. 
Para usarlo solo se necitan 3 pasos:
1. Definir el entorno con un archico docker y asi poder ser usado o reproducido donde sea.
2. Definir los servicios que conforman tu app en docker-compose.yml para que corran juntos en un entorno aislado.
3. Correr docker-compose up y Compose inicia y corre toda la app.
##### DOCKER IMAGE
> Archivo usado para ejecutar codigo en un contenedor Docker.
##### DOCKER RUN
> Docker corre procesos en contenedores aislados con su propio sistema de archivos. Un contenedor es un proceso que corre en un hospedador (host), local o remoto, 