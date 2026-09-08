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

No se evalúa que “arregles el código” (es lo fácil), sino que ejecutes un
**procedimiento repetible**: primero **detectar** los problemas, luego **probar
y revisar** para ubicarlos, después **diagnosticar** la causa y solo al final
**corregir**. Todo está en
[`docs/GUIA_CORRECCION.md`](docs/GUIA_CORRECCION.md), en los **Procedimientos
A → D**:

| | Procedimiento | Qué haces |
|---|---|---|
| **A** | Inspección y pruebas | Guion de casos de uso + pruebas de borde + barrido de consola/almacenamiento → **lista de hallazgos** |
| **B** | Triage | Severidad de cada hallazgo + tabla “síntoma → dónde mirar” + orden de ataque |
| **C** | Diagnóstico | Reproducir → aislar → instrumentar (`console.log`, breakpoints) → hipótesis → **verificarla con evidencia** |
| **D** | Corrección y verificación | Cambio mínimo a la causa raíz → re-test del caso → **re-test de regresión** → registrar prevención → commit |

**Flujo de una sesión:**

1. Levanta el proyecto (arriba) en una ventana de **incógnito**.
2. Abre **DevTools** (`F12`) → **Console** fija; ten a mano **Network** y
   **Application → Local Storage**.
3. Ejecuta el **Procedimiento A** entero **sin abrir `js/app.js`**: llena el
   guion de pruebas y anota los hallazgos `H-01…`.
4. Aplica el **Procedimiento B**: severidad y orden. Empieza por los bloqueantes.
5. Por cada hallazgo, **Procedimiento C**: escribe **tu diagnóstico** (la causa,
   no el síntoma) **antes** de abrir el bloque *“Ver diagnóstico”* de la guía.
6. **Procedimiento D**: corrige, vuelve a correr **todo el guion A.2** (no
   regresión) y registra causa raíz + prevención.

### Entregables

1. **Lista de hallazgos** con el guion de pruebas lleno (Procedimiento A).
2. **Tabla de triage** con severidades y orden de ataque (Procedimiento B).
3. **Registro de defectos** (una fila por defecto): síntoma → defecto
   (`archivo:línea`) → causa raíz → corrección → verificación → prevención → ISO/IEC 25010.
4. **`js/app.js` corregido**, un commit por defecto (`fix: … — causa raíz: …`).
5. **Media cuartilla:** qué 3 prácticas habrían evitado más de la mitad de los
   defectos (ver la guía).

## Cómo saber que quedó correcto

Se da por cerrado cuando **todo el guion de pruebas del Procedimiento A.2**
vuelve a pasar (checklist completo en `docs/GUIA_CORRECCION.md` → *“Checklist de
cierre”*):

- [ ] Sin errores rojos en consola al cargar ni al operar.
- [ ] **CU-1** Agregar un contacto **no recarga** la página y aparece en la lista.
- [ ] **CU-2** El alta sin teléfono se rechaza con aviso.
- [ ] **CU-3** Los contactos **persisten** tras recargar (`F5`).
- [ ] **CU-4** La búsqueda ignora mayúsculas/minúsculas.
- [ ] **CU-5** **Eliminar** quita solo el contacto elegido (probar 1.º, 2.º y último).
- [ ] **CU-6** La **edad** es la real, aunque el cumpleaños de este año aún no haya pasado.
