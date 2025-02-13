import * as errorsUtils from "../utils/errorsUtils";

export const validarId = (idParam: number): number => {
  const id = Number(idParam);

  if (!id || isNaN(id) || id <= 0) {
    throw errorsUtils.badRequestError("Id fonecido é invalido!S");
  }
  return id;
};
