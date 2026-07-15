# BluTV - Contexto del Proyecto

Última actualización: Julio 2026

---

# Objetivo del proyecto

BluTV es una aplicación IPTV para televisores Samsung Tizen (2016) desarrollada desde cero utilizando JavaScript Vanilla.

No utiliza React, Vue ni ningún framework.

La idea es construir una aplicación similar a:

- Tivimate
- IPTV Smarters
- SmartOne IPTV

pero con arquitectura propia y código limpio.

---
# UX/UI
| Variable            | Color              | Hex                |
| ------------------- | ------------------ | ------------------ |
| **Primary (BluTV)** | Azul principal     | `#1E88E5`          |
| **Primary Hover**   | Azul claro         | `#42A5F5`          |
| **Accent**          | Cian               | `#00BCD4`          |
| **Background**      | Azul muy oscuro    | `#0B1220`          |
| **Surface / Panel** | Gris azulado       | `#182332`          |
| **Surface Hover**   | Panel seleccionado | `#233247`          |
| **Card**            | Tarjetas           | `#1F2D3D`          |
| **Border**          | Bordes             | `#31465F`          |
| **Text Primary**    | Blanco             | `#FFFFFF`          |
| **Text Secondary**  | Gris claro         | `#B8C2CC`          |
| **Text Disabled**   | Gris               | `#6F7C8A`          |
| **Success**         | Verde              | `#4CAF50`          |
| **Warning**         | Amarillo           | `#FFC107`          |
| **Error**           | Rojo               | `#E53935`          |
| **Overlay**         | Negro translúcido  | `rgba(0,0,0,0.65)` |

---

# Tecnologías

Frontend

- HTML5
- CSS3
- JavaScript ES6 (Vanilla)

Plataforma

- Samsung Tizen
- AVPlay API

Backend

- Ninguno (consume API Xtream Codes)

Persistencia

- localStorage

Comunicación

- Fetch API

Arquitectura

- Componentes propios
- Router propio
- Session Manager
- Storage Manager
- AppState
- Player Manager
- Overlay Manager

---

# Arquitectura actual

Actualmente el proyecto utiliza los siguientes módulos.

app.js

Inicializa toda la aplicación.

Registra rutas.

Inicializa:

- Router
- Controls
- Overlay

router.js

Router SPA.

Se encarga de:

- registrar vistas
- renderizar vistas
- ejecutar init()
- ejecutar afterRender()

No utiliza frameworks.

storage.js | Responsable de guardar información en localStorage.

Actualmente guarda: credenciales Xtream.

session.js | Mantiene la sesión actual.

Guarda:
1. login
2. usuario
3. información del servidor

- Actualmente NO se recuerda exactamente si existe un método llamado loginUser() porque fue refactorizado durante el desarrollo.

Antes de continuar revisar el archivo real.

api.js

Toda comunicación con Xtream.
Debe utilizar Session para construir automáticamente la URL.

No debe volver a recibir:
server
usuario
password

como parámetros.

La API debe consumir Session.login.

player.js

Responsable de reproducir canales.

Tiene dos modos:
- Tizen: webapis.avplay
- Browser: HTML5 video (solo para pruebas)

Actualmente:
- audio funciona
- video pendiente de probar en TV física

overlay.js
Overlay superior.

Actualmente muestra:
- nombre canal
- hora

Debe evolucionar para mostrar:
1. logo
2. categoría
3. barra progreso (películas)

live.js | Vista TV Live.

Actualmente:
1. carga categorías
2. carga canales
3. permite navegar
4. permite reproducir

Necesita ser refactorizado para utilizar Session.

home.js | Pantalla principal.
1. Actualmente muy simple.
2. Debe evolucionar.

login.js | Pantalla login.

Actualmente:
1. autocompleta credenciales guardadas
2. permite login
3. utiliza Storage

Debe revisarse para terminar integración con Session.

controls.js | Controla modos del control remoto.

Actualmente existen modos:
1. live
2. player

Debe crecer en futuras fases.

appState.js | Creado recientemente.

Actualmente contiene:
1. screen
2. playerVisible
3. dialogOpen
4. history

También posee:

go()
back()
enterPlayer()
leavePlayer()

Es el inicio del gestor global de estado.

---

# Estado actual del proyecto

FASE 1 | Completada.

Arquitectura.

Incluye:
Storage
Session
API
Router
Autologin
Persistencia

FASE 2 | Completada.

TV Live.

Incluye:
categorías
canales
navegación
player
overlay básico

FASE 3 | En progreso.

Actualmente implementado:

AppState
historial básico
playerVisible

Falta:

Navigation Manager
Return inteligente
Exit Dialog
Preview Player
Focus Manager

---

# Filosofía de arquitectura

El proyecto NO debe tener lógica repetida.

Cada responsabilidad pertenece a un solo módulo.

Ejemplo:
Session
maneja sesión
API
consume servidor
Player
reproduce
Router
navega
Overlay
UI superior
AppState
estado global

---

# Objetivo de AppState

Debe convertirse en el cerebro de toda la aplicación.

Debe conocer:
pantalla actual
si existe diálogo
si el player está visible
modo preview
modo fullscreen
historial
No debe contener lógica de reproducción.
Solo estado.

---

# Objetivo futuro del Navigation Manager

Debe existir un único lugar donde se gestione el botón Return.

Ejemplo:

Navigation.back()

Internamente decidirá:

si hay diálogo
cerrarlo
si player fullscreen
volver a preview
si preview
volver a Live
si Live
volver a Home
si Home
abrir diálogo salir

---

# Flujo esperado del botón Return

Player fullscreen

↓

Return

↓

Live

(video pequeño)

↓

Return

↓

Home

↓

Return

↓

¿Desea salir?

↓

Cancelar / Salir

---

# Player

Actualmente se hace:

display:none
del div principal.
Esto debe eliminarse.
En el futuro existirán dos modos:
fullscreen
preview

En preview:

el video seguirá reproduciéndose
la lista volverá a mostrarse
el usuario podrá hacer zapping.

---

# Focus Manager

Actualmente:
focus
category
channel

Debe evolucionar.

Estados esperados:
home
live
player
dialog
search
movies
series
settings

---

# Exit Dialog

Debe ser reutilizable.
No solo servirá para salir.
También para:
cerrar sesión
borrar credenciales
confirmaciones
errores
avisos

---

# Movies

Todavía NO comenzar.
Esperar terminar Fase 3.
Cuando comience:
crear:
movies.js
Consumirá:
get_vod_categories
get_vod_streams

---

# Series

Después de Movies.
Crear:
series.js
Consumirá:
get_series_categories
get_series

---

# Búsqueda

Después de Movies y Series.
Debe utilizar teclado virtual de Samsung.
No teclado HTML.

---

# Configuración futura

Pantalla Settings.
Debe incluir:
Borrar credenciales
Cerrar sesión
Tema
Información aplicación
Versión

---

# Pendientes inmediatos

1. Revisar login.js
Confirmar cómo quedó la integración con Session.
Durante esta conversación hubo varios refactor.
No asumir nombres de funciones.
Leer primero el archivo real.

2. Revisar live.js
Eliminar dependencia de Storage.
Debe utilizar Session.

3. Revisar api.js
Confirmar que todos los métodos usan Session.
No deben recibir server/user/password.

4. Crear Navigation Manager.
Archivo nuevo:
navigation.js
Debe centralizar el botón Return.

5. Modificar Controls.
Delegar botón Return al Navigation Manager.
No manejar Return dentro de Live.

6. Crear Preview Player.
Eliminar display:none.
El player debe poder:
fullscreen
preview

7. Crear Exit Dialog reutilizable.

---

# Objetivo final del proyecto

BluTV debe sentirse como una aplicación comercial.
No como un proyecto universitario.
Debe tener una arquitectura escalable para soportar:
-TV Live
-Movies
-Series
-Favoritos
-Continuar viendo
-EPG
-Búsqueda
-Configuración

sin necesidad de reescribir el código existente.

Siempre priorizar:
código limpio
responsabilidades separadas
componentes reutilizables
mínimo acoplamiento
máxima legibilidad
UX/UI atractiva, fluida pero liviana para smarts tv's antiguas (2016)