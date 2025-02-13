import { barberModel } from "../models/barber-models";
import * as barberRepositories from "../repositories/barber-repositories";
import * as errorsUtils from "../utils/errorsUtils";
import { validarId } from "../utils/validateId";

export const createBarberService = async (
  barber: barberModel,
  fotoBuffer: Buffer
): Promise<{ id: number }> => {
  const { barbeariaId, nome, especialidade, telefone } = barber;

  if (!barbeariaId || !nome || !especialidade || !telefone || !fotoBuffer) {
    throw errorsUtils.badRequestError(
      "Campos obrigatórios não foram preenchidos."
    );
  }

  // Crie o objeto completo, incluindo a foto no formato buffer
  const barbertWithFoto = {
    ...barber,
    fotoBarbeiro: fotoBuffer, // A foto está no formato buffer aqui
  };

  const result = await barberRepositories.insertBarber(barbertWithFoto);

  return result;
};

export const getAllBarberService = async (): Promise<barberModel[]> => {
  return await barberRepositories.findAllBarber();
};

export const getBarberServiceById = async (
  id: number
): Promise<barberModel> => {
  id = validarId(id);
  const barber = await barberRepositories.findBarberById(id);

  if (!barber) throw errorsUtils.notFoundError("Barbeiro não encontrado.");

  return barber;
};

export const updateBarberService = async (
  id: number,
  barber: Partial<barberModel>
): Promise<barberModel | null> => {
  id = validarId(id);

  if (!barber || Object.keys(barber).length === 0) {
    throw errorsUtils.badRequestError(
      "Nenhum dado para atualizar foi fornecido."
    );
  }

  const validFields = [
    "nome",
    "barbeariaId",
    "especialidade",
    "telefone",
    "fotoBarbeiro",
  ];
  const invalidFields = Object.keys(barber).filter(
    (key) => !validFields.includes(key)
  );

  if (invalidFields.length) {
    throw errorsUtils.badRequestError(
      `Campos inválidos: ${invalidFields.join(", ")}`
    );
  }

  const existingBarber = await barberRepositories.findBarberById(id);
  if (!existingBarber)
    throw errorsUtils.notFoundError("Barbeiro não encontrado.");
  const result = await barberRepositories.updateBarber(id, barber);

  return result;
};

export const deleteBarberService = async (id: number): Promise<string> => {
  id = validarId(id);
  const result = await barberRepositories.deleteBarber(id);

  if (!result) throw errorsUtils.notFoundError("Barbeiro não encontrado.");

  return "Barbeiro deletado com sucesso!";
};
