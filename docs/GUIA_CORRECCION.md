# Guía de corrección — Agenda de Contactos

> **Para qué es esta guía.** Ustedes se están formando para **gestionar la
> calidad del software**: auditar sistemas ajenos y decidir si se liberan o no.
> Los 6 errores de este proyecto son una excusa. Lo que se evalúa es que
> apliquen **siempre el mismo método** para atacar un defecto, y que lo dejen
> **documentado**. Corregir el código es la parte fácil y la menos importante.

Para cada error verás:

1. **Síntoma** — lo que se observa al usar la app.
2. **Pistas para el diagnóstico** — dónde mirar y qué preguntarte.
3. **Tu diagnóstico** — escríbelo tú antes de seguir.
4. **Diagnóstico** *(oculto)* — haz clic en el triángulo para revelarlo y compararlo.
5. **Corrección** *(oculto)* — el cambio exacto en `js/app.js`.
6. **Cierre del defecto** *(oculto)* — severidad, causa raíz, prevención y la
   característica ISO/IEC 25010 afectada.

> Regla del ejercicio: **no abras “Diagnóstico” hasta haber escrito el tuyo.**
> Trabaja los errores **en orden** (1 → 6): cada arreglo destapa el siguiente.
> El Error 6 es independiente, pero se nota recién cuando ya puedes agregar
> contactos.

---

## Cómo atacar un defecto — el método (esto es lo que de verdad se transfiere)

### El ciclo: Reproducir → Aislar → Hipótesis → Verificar → Corregir → Probar

1. **Reproducir.** Consigue que el fallo ocurra *a voluntad*. Anota pasos
   exactos, datos usados y entorno (navegador y versión). Un defecto que no se
   reproduce no se puede corregir ni verificar.
2. **Aislar.** ¿Falla al cargar o al interactuar? ¿Lo dispara un dato concreto?
   ¿Qué función o línea? Herramientas: consola (`F12`), pestaña **Network**,
   pestaña **Application → Local Storage**, `console.log` y *breakpoints*.
3. **Hipótesis.** Escribe **una** causa probable en una frase, en términos de
   *causa*, no de *síntoma*: “el selector no encuentra el elemento”, no “no
   funciona el botón”.
4. **Verificar la hipótesis** *antes* de tocar código: un `console.log`, mirar
   el `id` real en el HTML, comparar tipos con `typeof`. Si la evidencia no la
   confirma, vuelve al paso 2.
5. **Corregir** con el cambio **mínimo** que ataca la **causa raíz**, no el
   síntoma.
6. **Probar de nuevo:** *confirmación* (el caso que fallaba ahora pasa) **y**
   *no regresión* (lo que ya funcionaba sigue funcionando). Repasa el checklist
   final.

### Síntoma ≠ Defecto ≠ Causa raíz

- **Síntoma:** lo que ve el usuario — “los contactos desaparecen al recargar”.
- **Defecto:** el error concreto en el código — la clave de `localStorage` al
  leer no coincide con la de escribir.
- **Causa raíz:** por qué se coló — una cadena literal repetida en dos lugares
  en vez de una constante única — y qué práctica lo habría evitado.

Corriges el **defecto**; tu valor como gestor de calidad está en identificar y
atacar la **causa raíz** para que esa *clase* de defecto no reaparezca.

### Ficha de defecto (llena una por cada error y entrégalas)

| Campo | Contenido |
|---|---|
| ID | DEF-01 |
| Título | (una línea) |
| Severidad | Bloqueante / Alta / Media / Baja |
| Cómo reproducir | pasos 1, 2, 3… + datos usados |
| Resultado esperado | |
| Resultado obtenido | con evidencia: texto de consola o captura |
| Componente / línea | `js/app.js:NN` |
| Defecto (causa técnica) | |
| Causa raíz | |
| Corrección aplicada | qué cambiaste y por qué es el cambio mínimo |
| Verificación | cómo comprobaste que quedó + prueba de no regresión |
| Prevención | linter / revisión / prueba / convención que lo evita |
| ISO/IEC 25010 afectada | Adecuación funcional, Fiabilidad, Usabilidad… |

> Las 7 fichas (6 errores + reto) son el entregable que demuestra el **método**,
> no solo el resultado.

---

### Preparación

- Levanta el proyecto (ver `README.md`).
- Abre DevTools con `F12` → pestaña **Console**. Déjala abierta todo el tiempo.
- Ten a la vista `js/app.js` en tu editor.
- Ten a mano la plantilla de **ficha de defecto** (arriba) para ir llenándola.

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

## Checklist final (confirmación + no regresión)

Tras corregir **todos**, vuelve a verificar la lista completa, no solo el último
arreglo:

- [ ] La consola no muestra errores rojos al cargar.
- [ ] Agregar un contacto **no recarga** la página.
- [ ] El contacto agregado aparece en la lista.
- [ ] Los contactos **persisten** tras recargar (`F5`).
- [ ] **Eliminar** quita solo el contacto elegido.
- [ ] La **edad** coincide con la real (probar cumpleaños ya pasado y aún por venir).
- [ ] La búsqueda **ignora** mayúsculas/minúsculas.

## Entregables del ejercicio

1. **7 fichas de defecto** (una por error + reto) con la plantilla de arriba.
2. **`js/app.js` corregido**, con un commit por defecto y mensaje claro
   (`fix: <qué> — causa raíz: <por qué>`).
3. **Media cuartilla de mejora de proceso:** de las 7 causas raíz, ¿qué **3
   prácticas** (linter, revisión de código, pruebas, convenciones, prueba de
   humo) habrían evitado más de la mitad de los defectos? Justifica.

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
