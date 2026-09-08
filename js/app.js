// ============================================================
//  Agenda de Contactos  -  app.js
// ============================================================
//  Este archivo contiene VARIOS errores intencionales.
//  Tu tarea: primero DIAGNOSTICAR (¿qué falla y por qué?) y
//  luego CORREGIR. Sigue docs/GUIA_CORRECCION.md.
// ============================================================

// --- Referencias al DOM ---------------------------------------
const form = document.querySelector("#formulario");
const inputNombre = document.querySelector("#nombre");
const inputTelefono = document.querySelector("#telefono");
const inputEmail = document.querySelector("#email");
const lista = document.querySelector("#lista-contactos");
const buscador = document.querySelector("#buscador");

const CLAVE_STORAGE = "agenda:contactos";

// --- Estado en memoria ---------------------------------------
let contactos = cargarContactos();
renderizar();

// --- Eventos ------------------------------------------------------
form.addEventListener("submit", function (evento) {
  const nombre = inputNombre.value.trim();
  const telefono = inputTel.value.trim();
  const email = inputEmail.value.trim();

  if (nombre === "" || telefono === "") {
    alert("El nombre y el teléfono son obligatorios.");
    return;
  }

  const nuevo = {
    id: Date.now(),
    nombre: nombre,
    telefono: telefono,
    email: email,
  };

  contactos.push(nuevo);
  guardarContactos();
  form.reset();
  inputNombre.focus();
  renderizar();
});

buscador.addEventListener("input", renderizar);

// --- Funciones -------------------------------------------------
function eliminarContacto(id) {
  contactos = contactos.filter(function (c) {
    return c.id !== id;
  });
  guardarContactos();
  renderizar();
}

function renderizar() {
  const texto = buscador.value.trim();
  const visibles = contactos.filter(function (c) {
    return c.nombre.includes(texto);
  });

  lista.innerHTML = "";

  if (visibles.length === 0) {
    lista.innerHTML = '<li class="vacio">No hay contactos para mostrar.</li>';
    return;
  }

  visibles.forEach(function (c) {
    const li = document.createElement("li");
    li.innerHTML =
      "<div><strong>" +
      c.nombre +
      "</strong><br><span>" +
      c.telefono +
      "</span> &middot; <span>" +
      (c.email || "&mdash;") +
      "</span></div>" +
      '<button onclick="eliminarContacto(\'' +
      c.id +
      "')\">Eliminar</button>";
    lista.appendChild(li);
  });
}

function guardarContactos() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(contactos));
}

function cargarContactos() {
  const datos = localStorage.getItem("contactos");
  if (datos) {
    return JSON.parse(datos);
  }
  return [];
}
