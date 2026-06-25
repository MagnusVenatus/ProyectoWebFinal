/**
 * Servicio: WikipediaService
 * Encapsula todo el acceso a la API de Wikipedia.
 */
const fetch = require('node-fetch');

const API_SEARCH  = 'https://es.wikipedia.org/w/api.php';
const API_SUMMARY = 'https://es.wikipedia.org/api/rest_v1/page/summary/';

/**
 * Busca títulos en Wikipedia que coincidan con el término.
 * @param {string} term  - Término de búsqueda
 * @param {number} limit - Cantidad máxima de resultados
 * @returns {Promise<Array<{title: string}>>}
 */
async function search(term, limit = 5) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: term,
    srlimit: String(limit),
    format: 'json',
    origin: '*'
  });
  const url = `${API_SEARCH}?${params.toString()}`;
  const res = await fetch(url);
  const body = await res.json();
  if (!body.query || !body.query.search) return [];
  return body.query.search.map((s) => ({ title: s.title }));
}

/**
 * Obtiene el resumen de un artículo de Wikipedia por título.
 * @param {string} title - Título exacto del artículo
 * @returns {Promise<{title: string, extract: string, url: string}|null>}
 */
async function getSummary(title) {
  const slug = encodeURIComponent(title.replace(/ /g, '_'));
  const url = API_SUMMARY + slug;
  const res = await fetch(url, { headers: { 'User-Agent': 'PatogenosApp/1.0' } });
  if (!res.ok) return null;
  const body = await res.json();
  return {
    title: body.title,
    extract: body.extract || '',
    url: body.content_urls
      ? body.content_urls.desktop.page
      : `https://es.wikipedia.org/wiki/${slug}`
  };
}

module.exports = { search, getSummary };
