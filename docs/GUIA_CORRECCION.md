# Guía de corrección — Agenda de Contactos

> **Para qué es esta guía.** Ustedes se están formando para **gestionar la
> calidad del software**: auditar sistemas ajenos y decidir si se liberan o no.
> El **entregable** es `js/app.js` corregido y funcionando. Pero para llegar ahí
> sin adivinar, sigan un **procedimiento** repetible: primero **detectar** los
> problemas, luego **probar y revisar** para ubicarlos, después **diagnosticar**
> la causa y recién al final **corregir**. Escribir el `fix` es el último paso;
> lo que se practica es todo lo anterior.

**Orden de lectura de esta guía:**

1. Primero los **Procedimientos A → D** de abajo. Son el método; se aplican a
   este proyecto y a cualquier sistema que audites.
2. Luego, cada **Error 1 → 6 + Reto**. Cada uno trae:
   - **Síntoma** — lo que debiste detectar en el **Procedimiento A**.
   - **Pistas para el diagnóstico** — cómo aislar la causa (**Procedimiento C**).
   - **Tu diagnóstico** — lo escribes tú **antes** de abrir nada.
   - **Diagnóstico** *(oculto)* — para contrastar con el tuyo.
   - **Corrección** *(oculto)* — el cambio exacto en `js/app.js` (**Proc. D**).
   - **Cierre del defecto** *(oculto)* — severidad, causa raíz, prevención,
     característica ISO/IEC 25010.

> Reglas: **no abras “Diagnóstico” hasta haber escrito el tuyo.** Trabaja los
> errores **en orden** (1 → 6): cada arreglo destapa el siguiente. El Error 6 es
> independiente, pero se nota recién cuando ya puedes agregar contactos.

---

## El método: cuatro procedimientos, siempre en este orden

No se toca el código hasta el Procedimiento C.

| | Procedimiento | Pregunta que responde | Producto que deja |
|---|---|---|---|
| **A** | Inspección y pruebas | ¿Qué falla? ¿cuándo y con qué datos? | Lista de hallazgos `H-01…H-0n` |
| **B** | Triage | ¿Qué tan grave? ¿por dónde empiezo? | Hallazgos priorizados por severidad |
| **C** | Diagnóstico | ¿Cuál es la **causa**, no el síntoma? | Causa confirmada con evidencia |
| **D** | Corrección y verificación | ¿Quedó, sin romper nada más? | Defecto cerrado + medida de prevención |

---

## Procedimiento A — Inspección y pruebas (identificar los problemas)

> Objetivo: encontrar **todos** los síntomas **antes** de abrir `js/app.js`.
> Trabaja como si no pudieras ver el código.

### A.0 — Preparar el entorno de prueba
1. Abre el proyecto en una **ventana de incógnito** (estado limpio, sin
   `localStorage` de intentos previos).
2. Abre **DevTools** (`F12`) y deja fija la pestaña **Console**.
3. Ubica también **Network** y **Application → Local Storage**.
4. Anota navegador y versión (`chrome://version`): es parte de la evidencia.

### A.1 — Prueba de humo (¿arranca?)
1. Carga la página.
2. Lee la **Console** de arriba abajo. ¿Hay texto **rojo**? Cópialo completo
   (mensaje + `archivo:línea`) → es un hallazgo.
3. Verifica que se ven los tres bloques: título, formulario y lista.
4. Si la app **no** arranca, sigue igualmente con los demás pasos anotando
   “no evaluable por H-01”; el hallazgo de humo queda como prioridad máxima.

### A.2 — Recorrido de casos de uso (guion de prueba)
Ejecuta cada fila **en orden**, con el dato indicado, y completa las dos últimas
columnas:

| # | Caso de uso | Pasos | Dato de prueba | Resultado esperado | Obtenido | ¿Defecto? |
|---|---|---|---|---|---|---|
| CU-1 | Alta de contacto | Llenar nombre + teléfono → **Agregar** | `Ana Torres` / `987654321` | Aparece en la lista; el formulario se limpia; la página **no** recarga | | |
| CU-2 | Alta sin obligatorios | Dejar teléfono vacío → **Agregar** | nombre `X`, teléfono vacío | Aviso de validación; no se agrega | | |
| CU-3 | Persistencia | Agregar 2 contactos → `F5` | — | Los 2 siguen en la lista | | |
| CU-4 | Búsqueda | Escribir en el buscador | `ana` (minúsculas) | Muestra “Ana Torres” | | |
| CU-5 | Eliminar | **Eliminar** en el 2.º de 3 contactos | 3 contactos cargados | Desaparece **solo** ese; quedan 2 | | |
| CU-6 | Edad | Alta con fecha de nacimiento | nacimiento `2000-12-31` | Muestra la edad real (años cumplidos **hoy**) | | |

Regla: **un** resultado obtenido por celda, objetivo y observable
(“la URL cambió a `index.html?nombre=...`”), nunca una interpretación
(“parece que no guarda”).

### A.3 — Pruebas de borde (datos límite)
- CU-6 otra vez con: `2000-01-01`, una fecha del **mes que viene**, `2000-02-29`.
- CU-4 otra vez con: `ANA`, `  ana  ` (con espacios), con acento `á`.
- CU-5 eliminando el **primero** y luego el **último** de la lista.

Cualquier diferencia de comportamiento = hallazgo aparte.

### A.4 — Barrido técnico
1. **Console:** repite las acciones con la Console visible. Todo error o
   *warning* que aparezca **al actuar** es un hallazgo, aunque la interfaz
   “parezca” funcionar.
2. **Application → Local Storage:** tras agregar, ¿se creó una clave?, ¿cómo se
   llama?, ¿contiene los datos? Compárala con lo que esperabas.
3. **Network:** al pulsar **Agregar**, ¿se dispara una recarga del documento?
   No debería.

### A.5 — Salida del Procedimiento A
Una **lista de hallazgos numerada**. Un hallazgo = una línea:

```
H-03 | CU-3 | Al recargar (F5) la lista queda vacía | evidencia: en Local Storage solo existe la clave "agenda:contactos"
```

---

## Procedimiento B — Triage (priorizar y ubicar)

Para cada hallazgo:

1. **¿Impide usar el sistema?** → asigna **severidad**:
   - Todo el sistema inutilizable → **Bloqueante**
   - Un caso de uso central roto (alta, guardar, eliminar) → **Alta**
   - Función secundaria, o un dato que se muestra mal → **Media**
   - Molestia con vía alterna → **Baja**
2. **¿Cuándo ocurre?** al cargar / al enviar el formulario / al pintar la lista
   / al eliminar / solo con ciertos datos. Esto ya acota la zona del código.
3. **¿Hay evidencia dura?** un error de consola con `archivo:línea` (vas casi
   directo) o solo comportamiento (habrá que instrumentar en el Proc. C).

**Orden de ataque:** primero los **Bloqueantes** (tapan al resto), luego por
severidad. Si un hallazgo tapa a otro, decláralo y sigue.

**Tabla de triage — síntoma → primer lugar donde mirar:**

| Síntoma observado | Primer lugar a revisar |
|---|---|
| Error rojo **al cargar** | La línea `archivo:línea` del error. ¿Un `querySelector` devolvió `null`? |
| La **URL cambia** / la página recarga al enviar | Manejador `submit`: ¿falta `preventDefault()`? |
| Error rojo **al pulsar** un control | La función que ejecuta ese control; nombres de variables |
| “Se ve” pero **no persiste** al recargar | `localStorage`: clave de escritura vs. clave de lectura |
| Acción **sin efecto** y **sin** error en consola | Comparaciones (`===` / `!==`), tipos (`typeof`), condiciones invertidas |
| Un **dato mostrado** es incorrecto | La función que calcula ese dato; probar casos borde |

---

## Procedimiento C — Diagnóstico (aislar y confirmar la causa)

Por cada hallazgo priorizado, en orden:

1. **Reproducir a voluntad.** Escribe la secuencia mínima que provoca el fallo
   el 100 % de las veces. Si es intermitente, halla qué lo vuelve determinista
   (un dato, un orden). Sin esto no se avanza.
2. **Reducir el alcance.** ¿Es de *carga* o de *interacción*? ¿Depende del dato?
   Quita variables hasta quedarte con el mínimo que aún falla.
3. **Instrumentar** (mirar, sin cambiar la lógica todavía):
   - `console.log(valor, typeof valor)` antes de la línea sospechosa.
   - *Breakpoint* en la pestaña **Sources** y avanzar paso a paso.
   - Comparar el HTML real del elemento contra el selector que usa el JS.
4. **Formular la hipótesis** en **una frase de causa**: “la función lee `X`, que
   nunca se declara” — no “el botón no anda”.
5. **Verificar la hipótesis con evidencia** *antes* de corregir. Si el
   `console.log` / breakpoint / HTML no la confirma → vuelve al paso 2 con otra
   hipótesis.
6. **Nombrar los tres niveles:**
   - *Síntoma:* lo que ve el usuario.
   - *Defecto:* la línea concreta que está mal (`archivo:línea`).
   - *Causa raíz:* por qué se coló — qué práctica faltó.

Solo con la causa **confirmada** pasas al Procedimiento D.

---

## Procedimiento D — Corrección y verificación

1. **Cambio mínimo** que ataca la **causa raíz**, no el síntoma. Sin parches
   alrededor del problema.
2. **Re-test del caso:** el `CU-n` que fallaba ahora pasa.
3. **Re-test de regresión:** vuelve a ejecutar **todo el Procedimiento A.2**.
   Un arreglo puede romper otra cosa.
4. **Registrar el cierre:** causa raíz + medida de prevención (linter, revisión
   de código, prueba automatizada, convención, prueba de humo…).
5. **Commit** por defecto: `fix: <qué cambió> — causa raíz: <por qué pasó>`.

---

### Instrumento de registro (apoyo, no el objetivo)

Para no perder trazabilidad, vuelca cada defecto en una fila:

```
ID | Severidad | CU | Síntoma | Defecto (archivo:línea) | Causa raíz | Corrección | Verificación (caso + regresión) | Prevención | ISO/IEC 25010
```

> El registro **documenta** que ejecutaste A → D; no lo reemplaza. Una tabla
> llena sin haber corrido los procedimientos no vale.

---

## Los 6 errores + reto

De aquí en adelante, **cada error es un hallazgo del Procedimiento A**. El
apartado *Síntoma* es lo que debiste observar en A.2; *Pistas* te guía en el
Procedimiento C; *Corrección* y *Cierre* corresponden al D. Escribe **tu
diagnóstico** antes de abrir los bloques ocultos.

---

## Error 1 — La aplicación no responde a nada

**Síntoma**
Cargas la página, escribes en el formulario, pulsas **Agregar** y no pasa nada.
El buscador tampoco reacciona.

**Pistas para el diagnóstico**
- Mira la consola apenas carga la página. ¿Hay un mensaje rojo?
- Lee el texto del error: suele decir algo como
  `Cannot read properties of null (reading 'addEventListener')`.
- Haz clic en el enlace `app.js:NN` del error para ir a la línea exacta.
- Si una variable “es `null`”, significa que `document.querySelector(...)` **no
  encontró** ese elemento. Compara el selector del JS con el `id` real en `index.html`.

**Tu diagnóstico** (escríbelo antes de continuar):

```
_______________________________________________________________
_______________________________________________________________
```

<details>
<summary>Ver diagnóstico</summary>

En `app.js` se busca el formulario con `document.querySelector("#formulario")`,
pero en `index.html` el formulario tiene `id="form-contacto"`.
Por eso `form` vale `null`, y en `form.addEventListener(...)` el script se rompe
**en esa línea**. Como el error detiene la ejecución, **nada más se registra**
(ni el submit ni el buscador).
</details>

<details>
<summary>Ver corrección</summary>

En `js/app.js`:

```js
// ANTES
const form = document.querySelector("#formulario");

// DESPUÉS
const form = document.querySelector("#form-contacto");
```

Recarga: el error rojo inicial debe desaparecer.
</details>

<details>
<summary>Cierre del defecto</summary>

- **Severidad:** Bloqueante — la aplicación entera no arranca.
- **Causa raíz:** el `id` del HTML y el selector del JS se escribieron por
  separado y nadie los comparó; no hubo **prueba de humo** (abrir la página y
  revisar que la consola no tenga errores) antes de dar por terminado.
- **Prevención:** prueba de humo tras cada cambio; editor/linter que resalte
  selectores; definir `id` y selector en el mismo momento y con el mismo nombre.
- **ISO/IEC 25010:** Adecuación funcional (completitud) · Fiabilidad (madurez).
</details>

---

## Error 2 — Al agregar, la página “parpadea” y no guarda nada

**Síntoma**
Completas el formulario, pulsas **Agregar** y la página se recarga sola.
La lista vuelve a quedar vacía. En la barra de direcciones aparece algo como
`index.html?nombre=Ana&telefono=987...`.

**Pistas para el diagnóstico**
- ¿Qué hace por defecto un `<form>` cuando se envía? ¿A dónde van esos datos
  en la URL (`?nombre=...`)?
- Busca en `app.js` el manejador `form.addEventListener("submit", ...)`.
- ¿Se está deteniendo el comportamiento por defecto del navegador dentro de ese
  manejador? ¿Qué método sirve para eso?

**Tu diagnóstico**:

```
_______________________________________________________________
_______________________________________________________________
```

<details>
<summary>Ver diagnóstico</summary>

El manejador del evento `submit` **nunca llama a `evento.preventDefault()`**.
Entonces el navegador hace el envío tradicional del formulario: recarga la
página con los datos en la URL. El JavaScript que agrega el contacto y renderiza
sí se ejecuta, pero la recarga inmediata borra todo de la memoria.
</details>

<details>
<summary>Ver corrección</summary>

En `js/app.js`, primera línea dentro del manejador `submit`:

```js
form.addEventListener("submit", function (evento) {
  evento.preventDefault();            // <-- AGREGAR ESTA LÍNEA

  const nombre = inputNombre.value.trim();
  // ...
});
```

Recarga y prueba: ahora la URL ya no cambia al pulsar **Agregar**.
</details>

<details>
<summary>Cierre del defecto</summary>

- **Severidad:** Alta — la funcionalidad central es inusable y se pierden los
  datos que el usuario escribió.
- **Causa raíz:** desconocer el comportamiento por defecto del `<form>` (enviar
  y recargar); se probó que el formulario “se ve”, no el caso de uso completo
  *agregar → aparece en la lista*.
- **Prevención:** checklist de revisión para formularios (“¿se llama a
  `preventDefault()`?”); prueba funcional del caso de uso, no solo del render.
- **ISO/IEC 25010:** Adecuación funcional (pertinencia) · Usabilidad.
</details>

---

## Error 3 — Al pulsar “Agregar” aparece un error en consola

**Síntoma**
Con los errores 1 y 2 ya corregidos, pulsas **Agregar** y en la consola sale
un mensaje rojo del tipo `ReferenceError: inputTel is not defined`.
El contacto no se añade.

**Pistas para el diagnóstico**
- Un `ReferenceError: X is not defined` significa que se usó una variable `X`
  que **nunca fue declarada**.
- Ve a la línea que indica el error. ¿Con qué nombre se declararon las
  referencias del DOM al inicio del archivo (`const inputNombre`, `const input...`)?
- Compara: ¿el nombre usado dentro del manejador coincide **exactamente** con
  el declarado arriba?

**Tu diagnóstico**:

```
_______________________________________________________________
_______________________________________________________________
```

<details>
<summary>Ver diagnóstico</summary>

Arriba se declara `const inputTelefono = document.querySelector("#telefono");`,
pero dentro del manejador `submit` se lee `inputTel.value`. La variable
`inputTel` no existe → `ReferenceError`. El error corta el manejador antes de
crear y guardar el contacto.
</details>

<details>
<summary>Ver corrección</summary>

En `js/app.js`, dentro del manejador `submit`:

```js
// ANTES
const telefono = inputTel.value.trim();

// DESPUÉS
const telefono = inputTelefono.value.trim();
```

Prueba: ahora el contacto aparece en la lista sin errores.
</details>

<details>
<summary>Cierre del defecto</summary>

- **Severidad:** Alta — no se puede registrar ningún contacto.
- **Causa raíz:** nombre de variable inconsistente (`inputTel` vs
  `inputTelefono`, abreviatura improvisada); no se ejecutó esa ruta de código
  antes de entregar.
- **Prevención:** `"use strict"` o linter con la regla `no-undef`;
  autocompletado del editor; **una** convención de nombres; revisión de código
  entre pares.
- **ISO/IEC 25010:** Adecuación funcional (corrección).
</details>

---

## Error 4 — Los contactos desaparecen al recargar

**Síntoma**
Agregas dos o tres contactos y se ven en la lista. Recargas la página (`F5`)
y la lista vuelve a estar vacía, aunque no diste error en ningún momento.

**Pistas para el diagnóstico**
- Abre DevTools → pestaña **Application** (o *Almacenamiento*) → **Local Storage**
  → tu origen. ¿Existe alguna clave? ¿Cómo se llama? ¿Tiene los contactos?
- En `app.js`, busca dónde se **escribe** en `localStorage` (`setItem`) y dónde
  se **lee** (`getItem`).
- Compara **letra por letra** la clave usada al guardar con la usada al leer.

**Tu diagnóstico**:

```
_______________________________________________________________
_______________________________________________________________
```

<details>
<summary>Ver diagnóstico</summary>

`guardarContactos()` escribe con la clave `CLAVE_STORAGE`, que vale
`"agenda:contactos"`. Pero `cargarContactos()` lee con
`localStorage.getItem("contactos")` — otra clave distinta.
Los datos **sí se guardan**, pero al iniciar se busca en una clave que siempre
está vacía, así que la lista arranca en `[]`.
</details>

<details>
<summary>Ver corrección</summary>

En `js/app.js`, dentro de `cargarContactos()`:

```js
// ANTES
const datos = localStorage.getItem("contactos");

// DESPUÉS
const datos = localStorage.getItem(CLAVE_STORAGE);
```

Usar siempre la constante `CLAVE_STORAGE` evita que las dos partes se
desincronicen. Prueba: agrega contactos, recarga y deben seguir ahí.

> Si te quedaron datos “sueltos” en la clave vieja, límpialos:
> en la consola escribe `localStorage.clear()` y recarga.
</details>

<details>
<summary>Cierre del defecto</summary>

- **Severidad:** Media — la app funciona durante la sesión; lo que falla es la
  **persistencia**, y sin evidencia (no hay error en consola) es fácil que pase
  desapercibido.
- **Causa raíz:** la clave existe como constante (`CLAVE_STORAGE`) y también
  como literal `"contactos"` → **dos fuentes de verdad** que se
  desincronizaron.
- **Prevención:** una sola constante usada tanto al leer como al escribir;
  prueba explícita *agregar → recargar → los datos siguen ahí*.
- **ISO/IEC 25010:** Fiabilidad · Adecuación funcional (los datos no se
  conservan).
</details>

---

## Error 5 — El botón “Eliminar” no elimina

**Síntoma**
Cada contacto tiene su botón **Eliminar**, pero al pulsarlo no pasa nada:
el contacto sigue en la lista. No hay error en consola.

**Pistas para el diagnóstico**
- Mira cómo se genera el botón en `renderizar()`. ¿Qué tipo de dato es `c.id`
  (lo crea `Date.now()`)? ¿Y qué se le pasa a `eliminarContacto(...)` desde el
  `onclick` del HTML? Fíjate en las comillas.
- En `eliminarContacto(id)` la comparación es `c.id !== id`.
  Añade `console.log(typeof c.id, typeof id)` dentro del `filter` y pulsa Eliminar.
  ¿Son del mismo tipo?
- Recuerda: `5 !== "5"` es `true` en JavaScript (número vs. texto).

**Tu diagnóstico**:

```
_______________________________________________________________
_______________________________________________________________
```

<details>
<summary>Ver diagnóstico</summary>

En `renderizar()` el botón se arma como
`onclick="eliminarContacto('123456789')"` — con comillas, así que llega un
**string**. Pero `c.id` es un **número** (`Date.now()`).
En `eliminarContacto`, el filtro `c.id !== id` compara número contra string:
como son de distinto tipo, `!==` siempre da `true` y `filter` **conserva todos**
los elementos. Nunca se borra nada.
</details>

<details>
<summary>Ver corrección</summary>

Dos formas válidas; con una basta.

**Opción A — pasar el id sin comillas (número):** en `renderizar()`

```js
// ANTES
'<button onclick="eliminarContacto(\'' + c.id + "')\">Eliminar</button>";

// DESPUÉS
'<button onclick="eliminarContacto(' + c.id + ')">Eliminar</button>';
```

**Opción B — normalizar el tipo dentro de la función:**

```js
function eliminarContacto(id) {
  const idNum = Number(id);
  contactos = contactos.filter(function (c) {
    return c.id !== idNum;
  });
  guardarContactos();
  renderizar();
}
```

Prueba: al pulsar **Eliminar** debe desaparecer **solo** ese contacto.
</details>

<details>
<summary>Cierre del defecto</summary>

- **Severidad:** Alta — no se puede eliminar; la lista solo crece y el usuario
  no tiene forma de corregir un contacto mal cargado.
- **Causa raíz:** mezcla de tipos —`Date.now()` produce un **número** y el
  `id` viaja como **texto** dentro del `onclick` interpolado— sumada a construir
  HTML por concatenación de cadenas.
- **Prevención:** normalizar el tipo antes de comparar (`Number(id)`), o mejor
  usar `dataset` + `addEventListener` en vez de `onclick` en texto; caso de
  prueba “eliminar el 2.º de 3 contactos”.
- **ISO/IEC 25010:** Adecuación funcional (corrección) · Usabilidad.
</details>

---

## Error 6 — La edad calculada está mal

**Síntoma**
Agregas un contacto con **Fecha de nacimiento**. En la lista aparece
`X años`, pero el número no siempre es correcto: para alguien cuyo cumpleaños
de este año **todavía no llega**, muestra **un año de más**.
Ejemplo (hoy es 2026): nacido el `2000-12-31` debería tener 25, pero muestra 26.
Nacido el `2000-01-01` sí sale bien.

**Pistas para el diagnóstico**
- Busca la función `calcularEdad(fechaNacimiento)` en `app.js`.
- ¿Qué datos usa para calcular? ¿Solo el **año**, o también **mes y día**?
- Escribe en la consola: con hoy `2026-09-08`, ¿cuánto da
  `2026 - 2000` para alguien que cumple años en diciembre? ¿Ya cumplió?
- Piensa: la edad baja en 1 si **este año todavía no ha pasado** su día de
  cumpleaños.

**Tu diagnóstico**:

```
_______________________________________________________________
_______________________________________________________________
```

<details>
<summary>Ver diagnóstico</summary>

`calcularEdad` hace solo `hoy.getFullYear() - nacimiento.getFullYear()`, es
decir **resta años sin mirar el mes ni el día**. Si la persona aún no ha
cumplido años este año, esa resta da uno de más. Falta restar 1 cuando la fecha
de hoy es **anterior** al cumpleaños de este año.
</details>

<details>
<summary>Ver corrección</summary>

En `js/app.js`, reemplaza la función:

```js
// ANTES
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  return hoy.getFullYear() - nacimiento.getFullYear();
}

// DESPUÉS
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);

  let edad = hoy.getFullYear() - anio;

  const cumpleEsteAnio = new Date(hoy.getFullYear(), mes - 1, dia);
  if (hoy < cumpleEsteAnio) {
    edad = edad - 1;
  }
  return edad;
}
```

Notas:
- Se parte el texto `"AAAA-MM-DD"` con `split("-")` en lugar de
  `new Date("...")` para evitar desfases de zona horaria de un día.
- `mes - 1` porque en JavaScript los meses van de `0` (enero) a `11` (diciembre).

Prueba con `2000-12-31` y con `2000-01-01`: ambos deben dar la edad real.
</details>

<details>
<summary>Cierre del defecto</summary>

- **Severidad:** Media — no rompe la app, pero muestra un **dato incorrecto** al
  usuario; en un sistema real (RR. HH., salud, banca) un cálculo de edad errado
  es motivo de *no-go*.
- **Causa raíz:** se modeló “edad” como *diferencia de años* en vez de *años
  cumplidos*; no se probó con fechas límite (cumpleaños aún por venir, fin de
  año, 29-feb).
- **Prevención:** definir el criterio de aceptación con una **tabla de casos**
  que incluya los bordes; aislar y probar la función de fecha por separado.
- **ISO/IEC 25010:** Adecuación funcional (exactitud).
</details>

---

## Reto adicional — El buscador distingue mayúsculas de minúsculas

**Síntoma**
Guardas el contacto `Ana`. Si buscas `Ana` aparece; si buscas `ana` no aparece.
El filtro solo funciona si escribes con la misma capitalización exacta.

**Pistas para el diagnóstico**
- Revisa `renderizar()`: cómo se obtiene `texto` y cómo se compara con `c.nombre`.
- `"Ana".includes("ana")` → ¿`true` o `false`? Pruébalo en la consola.
- ¿Qué método de string pone todo en minúsculas para comparar “sin importar”
  mayúsculas?

**Tu diagnóstico**:

```
_______________________________________________________________
_______________________________________________________________
```

<details>
<summary>Ver diagnóstico</summary>

La comparación es `c.nombre.includes(texto)` con ambos textos **tal cual**.
`includes` distingue mayúsculas/minúsculas, así que `"Ana".includes("ana")`
es `false`. Falta normalizar ambos lados a minúsculas antes de comparar.
</details>

<details>
<summary>Ver corrección</summary>

En `js/app.js`, dentro de `renderizar()`:

```js
// ANTES
const texto = buscador.value.trim();
const visibles = contactos.filter(function (c) {
  return c.nombre.includes(texto);
});

// DESPUÉS
const texto = buscador.value.trim().toLowerCase();
const visibles = contactos.filter(function (c) {
  return c.nombre.toLowerCase().includes(texto);
});
```

Prueba: buscar `ana`, `ANA` o `Ana` debe dar el mismo resultado.
</details>

<details>
<summary>Cierre del defecto</summary>

- **Severidad:** Baja — hay una vía alterna (escribir con la misma
  capitalización), pero degrada la búsqueda, que es una función clave.
- **Causa raíz:** comparar texto de la interfaz sin normalizar; no se probó
  buscar en minúsculas.
- **Prevención:** normalizar (`toLowerCase()`, y si aplica quitar acentos) en
  **toda** comparación de texto de UI; caso de prueba con distinta
  capitalización.
- **ISO/IEC 25010:** Usabilidad (operabilidad).
</details>

---

## Checklist de cierre (Procedimiento A.2 completo, como regresión)

Tras corregir **todos**, ejecuta otra vez el guion de pruebas completo, no solo
lo último que tocaste:

- [ ] A.1 — La consola no muestra errores rojos al cargar.
- [ ] CU-1 — Agregar un contacto **no recarga** la página y aparece en la lista.
- [ ] CU-2 — El alta sin teléfono se rechaza con aviso.
- [ ] CU-3 — Los contactos **persisten** tras recargar (`F5`).
- [ ] CU-4 — La búsqueda **ignora** mayúsculas/minúsculas (`ana`, `ANA`, `Ana`).
- [ ] CU-5 — **Eliminar** quita solo el contacto elegido (probar 1.º, 2.º y último).
- [ ] CU-6 — La **edad** coincide con la real (cumpleaños ya pasado y aún por venir).
- [ ] A.4 — Ningún error ni *warning* nuevo en consola al operar.

## Entregable

**`js/app.js` corregido y funcionando**, que pasa todo el *Checklist de cierre*
de arriba.

Los Procedimientos A → D son **el camino** para llegar ahí (y lo que conviene
practicar), pero no hay que entregar informes ni tablas: se evalúa el código
corregido.

## Resumen para el docente

### Tabla A — defecto y severidad

| # | Síntoma | Defecto (causa técnica) | Severidad | ISO/IEC 25010 |
|---|---------|-------------------------|-----------|---------------|
| 1 | Nada responde; error rojo al cargar | Selector `#formulario` ≠ `id="form-contacto"` → `null` | Bloqueante | Adecuación funcional · Fiabilidad |
| 2 | Al agregar, la página recarga y pierde datos | Falta `evento.preventDefault()` en el `submit` | Alta | Adecuación funcional · Usabilidad |
| 3 | `ReferenceError` al pulsar Agregar | Variable `inputTel` no declarada (es `inputTelefono`) | Alta | Adecuación funcional |
| 4 | Los contactos desaparecen al recargar | Clave `localStorage` distinta al leer (`"contactos"`) y escribir (`CLAVE_STORAGE`) | Media | Fiabilidad · Adecuación funcional |
| 5 | El botón Eliminar no hace nada | `id` string (comillas en `onclick`) vs número, comparado con `!==` | Alta | Adecuación funcional · Usabilidad |
| 6 | La edad mostrada está un año de más | `calcularEdad` resta solo `getFullYear`, ignora mes/día | Media | Adecuación funcional (exactitud) |
| R | La búsqueda distingue mayúsculas | `includes` sin `toLowerCase()` en ambos lados | Baja | Usabilidad |

### Tabla B — causa raíz → prevención

| # | Causa raíz | Práctica que lo evita |
|---|-----------|----------------------|
| 1 | `id` y selector escritos por separado, sin prueba de humo | Prueba de humo (abrir + consola limpia) tras cada cambio |
| 2 | Desconocer el comportamiento por defecto del `<form>`; probar solo el render | Checklist de revisión para formularios; prueba del caso de uso completo |
| 3 | Nombre de variable inconsistente; ruta de código no ejecutada | Linter `no-undef` / `"use strict"`; convención única de nombres; revisión de código |
| 4 | Dos fuentes de verdad para la clave (constante y literal) | Una sola constante en lectura y escritura; prueba de persistencia |
| 5 | Mezcla de tipos number/string; HTML por concatenación | Normalizar tipo (`Number`) o `dataset` + `addEventListener`; caso de prueba de borrado |
| 6 | “Edad” modelada como diferencia de años; sin casos borde | Criterios de aceptación con tabla de casos (incluye bordes); función de fecha probada aparte |
| R | Comparar texto sin normalizar; sin caso de prueba en minúsculas | Normalizar toda comparación de texto de UI; caso de prueba con capitalización distinta |
