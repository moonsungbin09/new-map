const LEVEL_TYPES = new Set(["지상", "지하", "산"]);

function validatePlaceInput(place) {
  if (!place?.name || !String(place.name).trim()) {
    throw new Error("장소명은 필수입니다.");
  }

  const latitude = Number(place.latitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("위도는 -90에서 90 사이여야 합니다.");
  }

  const longitude = Number(place.longitude);
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("경도는 -180에서 180 사이여야 합니다.");
  }

  if (!LEVEL_TYPES.has(place.level_type)) {
    throw new Error("level_type은 지상/지하/산 중 하나여야 합니다.");
  }
}

export function createPlaceService({ placeRepository }) {
  return {
    async createPlace(input) {
      validatePlaceInput(input);
      return placeRepository.insertPlace(input);
    },
    async getPlaces() {
      return placeRepository.listPlaces();
    },
    async getPlaceById(id) {
      return placeRepository.getPlace(id);
    }
  };
}
