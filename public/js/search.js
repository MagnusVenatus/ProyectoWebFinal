/**
 * search.js — Lógica del buscador de patógenos.
 * Muestra alerta de fuente (BD local / Wikipedia) al mostrar resultados.
 */

const input      = document.getElementById('input-buscar');
const datalist   = document.getElementById('sugerencias');
const btn        = document.getElementById('btn-buscar');
const resultados = document.getElementById('resultados');
const modoExperto = document.getElementById('modo-experto');

// ── Autocompletado con debounce ──────────────────────────────────────────────
let timeout = null;

input.addEventListener('input', () => {
  clearTimeout(timeout);
  const q = input.value.trim();
  if (!q) { datalist.innerHTML = ''; return; }

  timeout = setTimeout(async () => {
    try {
      // El endpoint devuelve [{ nombre, fuente }]
      const lista = await fetch(`/api/patogenos/suggest?q=${encodeURIComponent(q)}`).then(r => r.json());
      datalist.innerHTML = '';
      lista.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.nombre;
        datalist.appendChild(opt);
      });
    } catch { /* silencioso */ }
  }, 300);
});

// ── Búsqueda principal ───────────────────────────────────────────────────────
btn.addEventListener('click', buscar);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') buscar(); });

async function buscar() {
  const q = input.value.trim();
  if (!q) {
    mostrarVacio('Escribe el nombre de un patógeno para buscar.');
    return;
  }

  mostrarCargando();

  try {
    // Intentar en base de datos local
    const lista  = await fetch('/api/patogenos').then(r => r.json());
    const local  = lista.find(p => p.nombre.toLowerCase() === q.toLowerCase());

    if (local) {
      // ── Fuente: Base de Datos Local ──
      renderLocal(local);
      return;
    }

    // Buscar en Wikipedia si no está en la BD
    const ext = await fetch(`/api/patogenos/external?q=${encodeURIComponent(q)}`).then(r => r.json());

    if (ext && ext.length > 0) {
      // ── Fuente: Wikipedia ──
      renderExternal(ext);
    } else {
      mostrarVacio(`No se encontró información sobre "${q}".`);
    }

  } catch (err) {
    resultados.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>Ocurrió un error al buscar. Intenta de nuevo.</p>
      </div>`;
  }
}

// ── Render resultado local ───────────────────────────────────────────────────
function renderLocal(p) {
  const expert = modoExperto.checked;
  const resumen     = expert ? (p.resumen_experto     || p.resumen_publico     || '—') : (p.resumen_publico     || '—');
  const tratamiento = expert ? (p.tratamiento_experto || p.tratamiento_publico || '—') : (p.tratamiento_publico || '—');
  const fuente      = p.fuente
    ? `<a href="${p.fuente}" target="_blank" rel="noopener">${p.fuente}</a>`
    : '—';

  resultados.innerHTML = `
    <div class="result-local">
      <span class="source-badge local">Base de datos local</span>
      <h4>${p.nombre}</h4>
      <table class="result-table">
        <tr>
          <th>Resumen</th>
          <td>${resumen}</td>
        </tr>
        <tr>
          <th>Tratamiento</th>
          <td>${tratamiento}</td>
        </tr>
        <tr>
          <th>Fuente</th>
          <td>${fuente}</td>
        </tr>
      </table>
    </div>`;
}

// ── Render resultados externos (Wikipedia) ───────────────────────────────────
function renderExternal(lista) {
  const items = lista.map(item => `
    <div class="result-external-item">
      <h5>${item.title}</h5>
      <p>${item.extract || 'Sin extracto disponible.'}</p>
      <a href="${item.url}" target="_blank" rel="noopener">Ver en Wikipedia</a>
    </div>
  `).join('');

  resultados.innerHTML = `
    <span class="source-badge wikipedia">Wikipedia</span>
    ${items}`;
}

// ── Estados auxiliares ───────────────────────────────────────────────────────
function mostrarCargando() {
  resultados.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <span>Buscando información…</span>
    </div>`;
}

function mostrarVacio(msg) {
  resultados.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🔬</div>
      <p>${msg}</p>
    </div>`;
}

// Re-renderizar si cambia el toggle de modo experto y ya hay un resultado local
modoExperto.addEventListener('change', () => {
  // Solo re-renderizar si hay un resultado local visible
  const hayLocal = resultados.querySelector('.result-local');
  if (hayLocal) buscar();
});
