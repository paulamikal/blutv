# BluTV

**BluTV** es una aplicación IPTV para **Samsung Smart TVs** desarrollada con **HTML5, CSS3 y JavaScript (Vanilla)**, diseñada exclusivamente para servidores compatibles con la **Xtream Codes API**.

El proyecto fue desarrollado como una aplicación nativa para **Samsung Tizen**, priorizando un rendimiento fluido, una interfaz optimizada para televisores y una navegación completa mediante control remoto.

> **Estado del proyecto:** Finalizado.

---

## Características

* Inicio de sesión mediante servidor Xtream Codes.
* Opción para recordar credenciales utilizando `localStorage`.
* Navegación completamente optimizada para control remoto.
* TV en vivo con categorías y listado de canales.
* Vista previa automática de canales con sistema *debounce* para evitar cargas innecesarias.
* Reproductor multimedia basado en Samsung AVPlay.
* Películas organizadas por categorías.
* Series organizadas por categorías.
* Visualización de temporadas y episodios.
* Pantalla de detalles para películas y series.
* Controles avanzados de reproducción:

  * Reproducir / Pausar
  * Retroceder 10 segundos
  * Adelantar 10 segundos
  * Reiniciar reproducción
  * Saltar al final del contenido
* Pantalla de ajustes.
* Cerrar sesión.
* Eliminación de credenciales almacenadas.
* Diálogo de confirmación al salir de la aplicación.

---

## Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript ES6 (Vanilla)
* Samsung Tizen Web API
* Samsung AVPlay API
* Xtream Codes API
* localStorage

---

## Compatibilidad

BluTV es compatible con **Samsung Smart TVs** que ejecuten **Tizen 2.3 o superior**.

Probado en:

* Samsung Smart TV QLED Q8F (2025)

---

## Instalación

### Requisitos

* Tizen Studio
* TV Extensions para Tizen Studio
* Samsung Smart TV con modo desarrollador habilitado
* PC y TV conectados a la misma red local

### Despliegue

1. Abrir el proyecto en Tizen Studio.
2. Conectar la TV mediante **Device Manager** utilizando su dirección IP.
3. Verificar que la conexión sea correcta.
4. Ejecutar la aplicación mediante:

```text
Run As → Tizen Web Application
```

La aplicación será instalada automáticamente en el televisor.

---

## Estructura del proyecto

```text
blutv/
├── css/
├── js/
├── images/
├── config.xml
├── index.html
├── README.md
└── .gitignore
```

---

## Aviso

BluTV es un proyecto personal desarrollado con fines de aprendizaje y experimentación sobre el desarrollo de aplicaciones para Samsung Smart TV utilizando Tizen.

El código se publica únicamente con fines educativos y de portafolio. Si deseas utilizar parte del proyecto o adaptarlo para otro propósito, agradezco que se cite este repositorio como referencia.

---

## Autor

**Paula Mikal**

Ingeniera en Informática
