const LEVEL_TYPES = new Set(["지상", "지하", "산"]);

function createValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  error.statusCode = 400;
  return error;
}

function validatePlaceInput(place) {
  if (!place?.name || !String(place.name).trim()) {
    throw createValidationError("장소명은 필수입니다.");
  }

  const latitude = Number(place.latitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw createValidationError("위도는 -90에서 90 사이여야 합니다.");
  }

  const longitude = Number(place.longitude);
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw createValidationError("경도는 -180에서 180 사이여야 합니다.");
  }

  if (!LEVEL_TYPES.has(place.level_type)) {
    throw createValidationError("level_type은 지상/지하/산 중 하나여야 합니다.");
  }
}

export function createPlaceService({ placeRepository }) {
  return {
    async createPlace(input) {
      validatePlaceInput(input);
      return placeRepository.insertPlace(input);
    },
    async getPlaces({ limit }) {
      return placeRepository.listPlaces({ limit });
    },
    async getPlaceById(id) {
      return placeRepository.getPlace(id);
    }
  };
}
