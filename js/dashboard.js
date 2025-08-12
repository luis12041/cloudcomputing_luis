const SUPABASE_URL = "https://aplyqmgoinnerwbtyzmc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbHlxbWdvaW5uZXJ3YnR5em1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDUxMzgsImV4cCI6MjA3MDA4MTEzOH0._dPyvyWE2cGXCmg228CG5gjBP-kw17RqNgjJoPK-qp8";
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// Carga y muestra estudiantes
async function cargarEstudiantes() {
  const { data, error } = await supabase.from('estudiantes').select('*').order('id');
  if(error) {
    alert('Error cargando estudiantes: ' + error.message);
    return;
  }

  const lista = document.getElementById('lista-estudiantes');
  lista.innerHTML = '';
  data.forEach(estudiante => {
    const li = document.createElement('li');
    li.setAttribute('data-id', estudiante.id);
    li.innerHTML = `
      <span>${estudiante.nombre} - ${estudiante.correo} - ${estudiante.clase}</span>
      <button onclick="editarEstudiante(${estudiante.id})">Editar</button>
      <button onclick="eliminarEstudiante(${estudiante.id})">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

// Agrega un nuevo estudiante
async function agregarEstudiante() {
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const clase = document.getElementById('clase').value.trim();

  if(!nombre || !correo || !clase) {
    alert('Por favor llena todos los campos');
    return;
  }

  const { error } = await supabase.from('estudiantes').insert([{ nombre, correo, clase }]);
  if(error) {
    alert('Error al agregar estudiante: ' + error.message);
  } else {
    alert('Estudiante agregado');
    limpiarFormulario();
    cargarEstudiantes();
  }
}

function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('correo').value = '';
  document.getElementById('clase').value = '';
}

// Editar estudiante (muestra inputs en lugar del texto)
async function editarEstudiante(id) {
  const li = document.querySelector(`li[data-id='${id}']`);
  const { data, error } = await supabase.from('estudiantes').select('*').eq('id', id).single();
  if(error) {
    alert('Error al obtener estudiante: ' + error.message);
    return;
  }

  li.innerHTML = `
    <input type="text" id="edit-nombre-${id}" value="${data.nombre}" />
    <input type="email" id="edit-correo-${id}" value="${data.correo}" />
    <input type="text" id="edit-clase-${id}" value="${data.clase}" />
    <button onclick="guardarEstudiante(${id})">Guardar</button>
    <button onclick="cancelarEdicion()">Cancelar</button>
  `;
}

function cancelarEdicion() {
  cargarEstudiantes();
}

// Guarda cambios de estudiante
async function guardarEstudiante(id) {
  const nombre = document.getElementById(`edit-nombre-${id}`).value.trim();
  const correo = document.getElementById(`edit-correo-${id}`).value.trim();
  const clase = document.getElementById(`edit-clase-${id}`).value.trim();

  if(!nombre || !correo || !clase) {
    alert('Por favor llena todos los campos');
    return;
  }

  const { error } = await supabase.from('estudiantes').update({ nombre, correo, clase }).eq('id', id);
  if(error) {
    alert('Error al actualizar estudiante: ' + error.message);
  } else {
    alert('Estudiante actualizado');
    cargarEstudiantes();
  }
}

// (Opcional) Eliminar estudiante
async function eliminarEstudiante(id) {
  if(!confirm('¿Quieres eliminar este estudiante?')) return;

  const { error } = await supabase.from('estudiantes').delete().eq('id', id);
  if(error) {
    alert('Error al eliminar estudiante: ' + error.message);
  } else {
    alert('Estudiante eliminado');
    cargarEstudiantes();
  }
}

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
  cargarEstudiantes();
});