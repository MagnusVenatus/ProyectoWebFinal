/**
 * admin.js (frontend) — Panel de administración de patógenos.
 */

const loginCard  = document.getElementById('login-card');
const adminPanel = document.getElementById('admin-panel');
const tablaLocal = document.getElementById('tabla-local');
const loginError = document.getElementById('login-error');
let token = null;

// ── Login ────────────────────────────────────────────────────────────────────
document.getElementById('btn-login').addEventListener('click', async () => {
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  try {
    const res  = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass })
    });

    if (res.ok) {
      const body = await res.json();
      token = body.token;
      loginCard.style.display  = 'none';
      adminPanel.style.display = 'block';
      loadLocal();
    } else {
      loginError.classList.remove('d-none');
    }
  } catch {
    loginError.textContent = 'Error de conexión. Verifica que el servidor esté activo.';
    loginError.classList.remove('d-none');
  }
});

// Ocultar error al escribir
['user', 'pass'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    loginError.classList.add('d-none');
  });
});

// ── Cargar y renderizar tabla ────────────────────────────────────────────────
async function loadLocal() {
  try {
    const lista = await fetch('/api/patogenos').then(r => r.json());
    renderTable(lista);
  } catch {
    tablaLocal.innerHTML = '<p class="text-danger">Error cargando patógenos.</p>';
  }
}

function renderTable(lista) {
  if (!lista || lista.length === 0) {
    tablaLocal.innerHTML = '<p class="text-secondary">No hay patógenos registrados aún.</p>';
    return;
  }
  tablaLocal.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map(p => `
            <tr>
              <td class="fw-medium">${p.nombre}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarPatogen(${p.id})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarPatogen(${p.id}, '${escHtml(p.nombre)}')">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

// ── Editar ───────────────────────────────────────────────────────────────────
window.editarPatogen = async (id) => {
  try {
    const p = await fetch(`/api/patogenos/${id}`).then(r => r.json());
    document.getElementById('p-id').value            = p.id;
    document.getElementById('p-nombre').value        = p.nombre;
    document.getElementById('p-resumen').value       = p.resumen_publico     || '';
    document.getElementById('p-tratamiento').value   = p.tratamiento_publico || '';
    document.getElementById('p-resumen-exp').value   = p.resumen_experto     || '';
    document.getElementById('p-tratamiento-exp').value = p.tratamiento_experto || '';
    document.getElementById('p-fuente').value        = p.fuente              || '';
    document.getElementById('form-title').textContent = `Editando: ${p.nombre}`;
    // Scroll al formulario
    document.getElementById('form-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {
    alert('Error cargando el patógeno para editar.');
  }
};

// ── Eliminar ─────────────────────────────────────────────────────────────────
window.eliminarPatogen = async (id, nombre) => {
  if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
  try {
    const res = await fetch(`/api/patogenos/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    });
    if (res.ok) { loadLocal(); }
    else { alert('Error al eliminar el patógeno.'); }
  } catch {
    alert('Error de conexión al eliminar.');
  }
};

// ── Guardar (crear o actualizar) ─────────────────────────────────────────────
document.getElementById('btn-save').addEventListener('click', async () => {
  const id   = document.getElementById('p-id').value;
  const body = {
    nombre:              document.getElementById('p-nombre').value,
    resumen_publico:     document.getElementById('p-resumen').value,
    tratamiento_publico: document.getElementById('p-tratamiento').value,
    resumen_experto:     document.getElementById('p-resumen-exp').value,
    tratamiento_experto: document.getElementById('p-tratamiento-exp').value,
    fuente:              document.getElementById('p-fuente').value
  };

  if (!body.nombre.trim()) {
    alert('El nombre del patógeno es obligatorio.');
    document.getElementById('p-nombre').focus();
    return;
  }

  const opts = {
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify(body)
  };

  try {
    const res = id
      ? await fetch(`/api/patogenos/${id}`, { method: 'PUT', ...opts })
      : await fetch('/api/patogenos',         { method: 'POST', ...opts });

    if (res.ok) {
      resetForm();
      loadLocal();
    } else {
      const err = await res.json();
      alert('Error: ' + (err.error || 'No se pudo guardar.'));
    }
  } catch {
    alert('Error de conexión al guardar.');
  }
});

// ── Cancelar ─────────────────────────────────────────────────────────────────
document.getElementById('btn-cancel').addEventListener('click', resetForm);

function resetForm() {
  document.getElementById('p-id').value               = '';
  document.getElementById('p-nombre').value           = '';
  document.getElementById('p-resumen').value          = '';
  document.getElementById('p-tratamiento').value      = '';
  document.getElementById('p-resumen-exp').value      = '';
  document.getElementById('p-tratamiento-exp').value  = '';
  document.getElementById('p-fuente').value           = '';
  document.getElementById('form-title').textContent   = 'Agregar patógeno';
}

// ── Utilidad ─────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
