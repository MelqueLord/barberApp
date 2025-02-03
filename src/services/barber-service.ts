import { barberModel } from "../models/barber-models";
import * as barberRepositories from "../repositories/barber-repositories";
import * as errorsUtils from "../utils/errorsUtils";
import { validarId } from "../utils/validateId";

export const createBarberService = async (
  barber: barberModel,
  fotoBuffer: Buffer
): Promise<{ id: number }> => {
  const { barbeariaId, nome, especialidade, telefone } = barber;

  try {
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
  } catch (err: any) {
    if (err.type === "bad_request")
      console.error("Erro ao inserir barbeiro:", err);
    throw errorsUtils.databaseError("Falha ao acessar banco de dados.");
  }
};

export const getAllBarberService = async (): Promise<barberModel[]> => {
  try {
    const barbers = await barberRepositories.findAllBarber();

    return barbers;
  } catch (err) {
    console.error("Erro ao buscar Barbearias:", err);
    throw errorsUtils.databaseError(
      "Falha ao processar os dados dos barbeiros."
    );
  }
};

export const getBarberServiceById = async (
  id: number
): Promise<barberModel | null> => {
  try {
    const idBarber = validarId(id); // Valida o ID
    const barberById = await barberRepositories.findBarberById(idBarber);

    // Se o barbeiro não for encontrado, lança um erro
    if (!barberById) {
      throw errorsUtils.notFoundError("Barbeiro não encontrado.");
    }

    return barberById;
  } catch (err: any) {
    if (err.type === "not_found") {
      throw err; // Repassa erros de "não encontrado"
    }
    console.error("Erro no serviço de busca de barbeiro pelo ID:", err);
    throw errorsUtils.databaseError("Falha ao acessar o banco de dados.");
  }
};

export const updateBarberService = async (
  id: number,
  barber: Partial<barberModel>
): Promise<barberModel | null> => {
  try {
    const idBarber = validarId(id);

    // Regra de negócio 2: Garantir que pelo menos um campo seja atualizado
    if (!barber || Object.keys(barber).length === 0) {
      throw errorsUtils.badRequestError(
        "Nenhum dado para atualizar foi fornecido."
      );
    }

    // Regra de negócio 3: Garantir que os campos enviados sejam válidos
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

    if (invalidFields.length > 0) {
      throw errorsUtils.badRequestError(
        `Campos inválidos fornecidos: ${invalidFields.join(", ")}`
      );
    }

    // Regra de negócio 4: Verificar se o barbeiro existe antes de atualizar
    const existingBarber = await barberRepositories.findBarberById(idBarber);
    if (!existingBarber) {
      throw errorsUtils.notFoundError("Barbeiro não encontrado.");
    }

    // Chamar o repositório para atualizar o barbeiro
    const updatedBarber = await barberRepositories.updateBarber(
      idBarber,
      barber
    );

    // Verificar se a atualização foi bem-sucedida
    if (!updatedBarber) {
      throw errorsUtils.databaseError("Falha ao atualizar o barbeiro.");
    }

    return updatedBarber;
  } catch (err: any) {
    if (err.type === "bad_request" || err.type === "not_found") {
      throw err; // Repassa erros de validação ou "não encontrado"
    }
    console.error("Erro no serviço de atualizar barbeiro:", err.message);
    throw errorsUtils.databaseError("Falha ao acessar o banco de dados.");
  }
};

export const deleteBarberService = async (id: number): Promise<string> => {
  try {
    const idBarber = validarId(id);
    const result = await barberRepositories.deleteBarber(idBarber);

    return result;
  } catch (err: any) {
    if (err.type === "not_found") {
      throw err; // Repassa erros de "não encontrado"
    }
    console.error("Não foi possível excluir o barbeiro:", err);
    throw errorsUtils.databaseError("Falha ao acessar o banco de dados.");
  }
};
