import * as barbershopRepositories from "../repositories/barbershop-repositories";
import { barbershopModel } from "../models/barbershop-models";
import * as errorsUtils from "../utils/errorsUtils";
import { validarId } from "../utils/validateId";

export const createBarbershopService = async (
  barbershop: barbershopModel
): Promise<{ id: number }> => {
  const {
    nome,
    endereco,
    telefone,
    abertura,
    fechamento,
    diaAbertura,
    diaFechamento,
  } = barbershop;

  if (
    !nome ||
    !endereco ||
    !telefone ||
    !abertura ||
    !fechamento ||
    !diaAbertura ||
    !diaFechamento
  ) {
    throw errorsUtils.badRequestError(
      "Campos obrigatórios não foram preenchidos."
    );
  }

  const result = await barbershopRepositories.insertBarbershop(barbershop);
  return result;
};

export const getAllBarbershopsService = async (): Promise<
  barbershopModel[]
> => {
  return await barbershopRepositories.findallBarbershop();
};

export const getBarbershopByIdService = async (
  id: number
): Promise<barbershopModel> => {
  id = validarId(id);
  const barbershop = await barbershopRepositories.findBarbershopById(id);

  if (!barbershop) throw errorsUtils.notFoundError("Barbearia não encontrada.");

  return barbershop;
};

export const updateBarbershopService = async (
  id: number,
  barbershop: Partial<barbershopModel>
): Promise<barbershopModel | null> => {
  id = validarId(id);

  if (!barbershop || Object.keys(barbershop).length === 0) {
    throw errorsUtils.badRequestError(
      "Nenhum dado para atualizar foi fornecido."
    );
  }

  const validFields = [
    "nome",
    "endereco",
    "telefone",
    "abertura",
    "fechamento",
    "diaAbertura",
    "diaFechamento",
  ];
  const invalidFields = Object.keys(barbershop).filter(
    (key) => !validFields.includes(key)
  );

  if (invalidFields.length) {
    throw errorsUtils.badRequestError(
      `Campos inválidos: ${invalidFields.join(", ")}`
    );
  }

  const existingBarbershop = await barbershopRepositories.findBarbershopById(
    id
  );
  if (!existingBarbershop)
    throw errorsUtils.notFoundError("Barbearia não encontrada.");

  const result = await barbershopRepositories.updateBarbershop(id, barbershop);
  return result;
};

export const deleteBarbershopService = async (id: number): Promise<string> => {
  id = validarId(id);
  const existingBarbershop = await barbershopRepositories.findBarbershopById(
    id
  );

  if (!existingBarbershop) {
    throw errorsUtils.notFoundError("Barbearia não encontrada.");
  }

  await barbershopRepositories.deleteBarbershop(id);
  return "Barbearia deletada com sucesso!";
};
