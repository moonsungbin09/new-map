export function createPlaceRepository({ sql }) {
  return {
    insertPlace(place) {
      return sql.insertPlace(place);
    },
    listPlaces({ limit }) {
      return sql.listPlaces({ limit });
    },
    getPlace(id) {
      return sql.getPlace(id);
    }
  };
}
