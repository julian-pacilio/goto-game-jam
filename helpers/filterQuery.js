/**
 * Convierte un objeto de filtro en un objeto de filtro compatible con MongoDB.
 *
 * Si el objeto de filtro de entrada tiene una propiedad "genre", se copia al objeto de filtro de salida.
 *
 * Si el objeto de filtro de entrada tiene una propiedad "edition", se copia al objeto de filtro de salida.
 */
export default function filterQueryToMongo(filter) {
  const filterMongo = {};

  if (filter.genre) {
    filterMongo.genre = filter.genre;
  }

  if (filter.edition) {
    filterMongo.edition = filter.edition;
  }

  if (filter.edition == 'all') {
    filterMongo.edition = { $exists: true }
  }

  return filterMongo;
}
