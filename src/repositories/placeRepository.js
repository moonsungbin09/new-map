export function createPlaceRepository({ sql }) {
  return {
    insertPlace(place) {
      return sql.insertPlace(place);
    },
    listPlaces() {
      return sql.listPlaces();
    },
    getPlace(id) {
      return sql.getPlace(id);
    }
  };
}
