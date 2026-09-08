# Guía de corrección — Agenda de Contactos

Esta guía **no te da la solución de inmediato**. Para cada error verás:

1. **Síntoma** — lo que se observa al usar la app.
2. **Pistas para el diagnóstico** — dónde mirar y qué preguntarte.
3. **Tu diagnóstico** — escríbelo tú antes de seguir.
4. **Diagnóstico** *(oculto)* — haz clic en el triángulo para revelarlo y compararlo.
5. **Corrección** *(oculto)* — el cambio exacto en `js/app.js`.

> Regla del ejercicio: **no abras “Diagnóstico” hasta haber escrito el tuyo.**
> Trabaja los errores **en orden**: cada arreglo destapa el siguiente.

### Preparación

- Levanta el proyecto (ver `README.md`).
- Abre DevTools con `F12` → pestaña **Console**. Déjala abierta todo el tiempo.
- Ten a la vista `js/app.js` en tu editor.

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

---

## Checklist final

- [ ] La consola no muestra errores rojos al cargar.
- [ ] Agregar un contacto **no recarga** la página.
- [ ] Los contactos **persisten** tras recargar.
- [ ] **Eliminar** quita solo el contacto elegido.
- [ ] La **edad** que se muestra coincide con la real (probar cumpleaños ya
      pasado y aún por venir este año).
- [ ] La búsqueda **ignora** mayúsculas/minúsculas.

## Resumen de los errores (para el docente)

| # | Archivo | Tipo de error | Concepto que se practica |
|---|---------|---------------|--------------------------|
| 1 | `app.js` | Selector `#formulario` ≠ `id="form-contacto"` | Leer la consola; `querySelector` que devuelve `null` |
| 2 | `app.js` | Falta `evento.preventDefault()` | Comportamiento por defecto del `<form>` |
| 3 | `app.js` | Variable `inputTel` no declarada (`inputTelefono`) | `ReferenceError`; nombres consistentes |
| 4 | `app.js` | Clave de `localStorage` distinta al leer y escribir | Persistencia; usar una constante única |
| 5 | `app.js` | `id` string (con comillas en `onclick`) vs. número; `!==` | Tipos en JS; comparación estricta |
| 6 | `app.js` | `calcularEdad` resta solo años, ignora mes/día | Manejo de fechas; edad = años cumplidos, no diferencia de años |
| R | `app.js` | `includes` sin `toLowerCase()` | Comparación de texto sin distinción de caso |
