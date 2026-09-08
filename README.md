# Ejemplo: Agenda de Contactos (con errores)

Mini aplicación **GUI de escritorio/web** hecha con **HTML + CSS + JavaScript puro**
(sin frameworks, sin instalación). Sirve como ejercicio de **diagnóstico y
corrección de errores**.

La app *debería* permitir:

- Registrar contactos (nombre, teléfono, correo).
- Listarlos y buscarlos por nombre.
- Eliminar un contacto.
- Conservar los datos al recargar la página (usa `localStorage`).

> **Estado actual:** la aplicación **NO funciona correctamente**. Tiene 5 errores
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

1. Levanta el proyecto (arriba).
2. Abre las **DevTools** del navegador con `F12` → pestaña **Console**.
3. Intenta usar la app: agregar un contacto, recargar, buscar, eliminar.
4. Anota cada síntoma que observes.
5. Abre [`docs/GUIA_CORRECCION.md`](docs/GUIA_CORRECCION.md) y, para cada
   síntoma, **primero escribe tu diagnóstico** y recién después revela y aplica
   la corrección.
6. Vuelve a probar tras cada arreglo: un error suele tapar al siguiente.

## Cómo saber que quedó correcto

- [ ] Al cargar la página no hay errores rojos en la consola.
- [ ] Puedo agregar un contacto y aparece en la lista **sin que la página se recargue**.
- [ ] Si recargo la página, los contactos **siguen ahí**.
- [ ] El botón **Eliminar** quita solo el contacto elegido.
- [ ] El buscador filtra por nombre **aunque escriba en mayúsculas o minúsculas**.
