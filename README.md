# Ejemplo: Agenda de Contactos (con errores)

Mini aplicación **GUI de escritorio/web** hecha con **HTML + CSS + JavaScript puro**
(sin frameworks, sin instalación). Sirve como ejercicio de **diagnóstico y
corrección de errores**.

La app *debería* permitir:

- Registrar contactos (nombre, teléfono, correo, fecha de nacimiento).
- Mostrar la **edad** a partir de la fecha de nacimiento.
- Listarlos y buscarlos por nombre.
- Eliminar un contacto.
- Conservar los datos al recargar la página (usa `localStorage`).

> **Estado actual:** la aplicación **NO funciona correctamente**. Tiene 6 errores
> principales + 1 reto adicional. Tu trabajo es encontrarlos y arreglarlos.
> Guía paso a paso: [`docs/GUIA_CORRECCION.md`](docs/GUIA_CORRECCION.md).

---

## Estructura

```
ejemplo-agenda-js/
├── index.html              # Interfaz (formulario + lista)
├── css/estilos.css         # Estilos
├── js/app.js               # Lógica (AQUÍ están los errores)
├── docs/GUIA_CORRECCION.md # Guía: primero diagnóstico, luego corrección
├── scripts/run.ps1         # Levantar en Windows (PowerShell)
└── scripts/run.sh          # Levantar en Linux / macOS / Git Bash
```

---

## Cómo levantar el proyecto

No necesita compilar ni instalar dependencias. Elige **una** opción.

### Opción 1 — Doble clic (la más rápida)

Abre `index.html` con doble clic. Se abrirá en tu navegador.
Funciona, aunque algunos navegadores restringen `localStorage` sobre `file://`.

### Opción 2 — Servidor local (recomendada)

Un servidor local evita restricciones del navegador y es más parecido a producción.

**Windows (PowerShell), desde la carpeta del proyecto:**

```powershell
./scripts/run.ps1
```

**Linux / macOS / Git Bash:**

```bash
./scripts/run.sh
```

Ambos scripts levantan un servidor estático en <http://localhost:8000>
(usan Python si está disponible; si no, Node con `npx serve`).

**Manual, si prefieres:**

```bash
# con Python 3
python -m http.server 8000
# o con Node
npx serve -l 8000
```

Luego abre <http://localhost:8000> en el navegador.

### Opción 3 — VS Code + Live Server

Instala la extensión **Live Server**, clic derecho sobre `index.html`
→ *"Open with Live Server"*.

---

## Cómo trabajar el ejercicio

No se evalúa que “arregles el código” (eso es lo fácil), sino que apliques
**siempre el mismo método** para atacar un defecto y lo dejes **documentado**.
Ese método está explicado en [`docs/GUIA_CORRECCION.md`](docs/GUIA_CORRECCION.md)
→ sección *“Cómo atacar un defecto”* (ciclo Reproducir → Aislar → Hipótesis →
Verificar → Corregir → Probar, distinción síntoma / defecto / causa raíz, y la
**ficha de defecto** que llenas una por error).

1. Levanta el proyecto (arriba).
2. Abre las **DevTools** con `F12` → pestaña **Console** (déjala abierta).
3. Usa la app tratando de **reproducir** cada fallo a voluntad: agregar, recargar,
   buscar, eliminar, poner fecha de nacimiento.
4. Por cada fallo, empieza una **ficha de defecto** con los pasos exactos y la
   evidencia (texto de consola, captura).
5. Escribe **tu diagnóstico** (la causa, no el síntoma) **antes** de abrir el
   bloque *“Ver diagnóstico”* de la guía; luego compara.
6. Aplica la **corrección mínima**, y completa la ficha con *causa raíz* y
   *prevención* (bloque *“Cierre del defecto”* de la guía).
7. Vuelve a probar **toda** la lista del checklist, no solo lo último: un arreglo
   puede romper otra cosa (no regresión).

### Entregables

1. **7 fichas de defecto** (6 errores + 1 reto).
2. **`js/app.js` corregido**, un commit por defecto (`fix: … — causa raíz: …`).
3. **Media cuartilla:** qué 3 prácticas habrían evitado más de la mitad de los
   defectos (ver la guía).

## Cómo saber que quedó correcto

- [ ] Al cargar la página no hay errores rojos en la consola.
- [ ] Puedo agregar un contacto y aparece en la lista **sin que la página se recargue**.
- [ ] Si recargo la página, los contactos **siguen ahí**.
- [ ] El botón **Eliminar** quita solo el contacto elegido.
- [ ] La **edad** mostrada es la real, aunque el cumpleaños de este año aún no haya pasado.
- [ ] El buscador filtra por nombre **aunque escriba en mayúsculas o minúsculas**.
