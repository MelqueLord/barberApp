import * as barberService from "../services/barber-service";
import status from "http-status";
import { Request, Response } from "express";
import { validarId } from "../utils/validateId";
import * as errorsUtils from "../utils/errorsUtils";

export const postBarber = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const file = req.file;
    const barber = req.body;

    // Valida se a foto foi enviada
    if (!file) {
      throw errorsUtils.badRequestError("Foto é obrigatória.");
    }

    const fotoBuffer = file.buffer;

    // Chama a service para criar o barbeiro
    const newBarber = await barberService.createBarberService(
      barber,
      fotoBuffer
    );

    // Retorna a resposta com sucesso
    return res.status(status.CREATED).json(newBarber);
  } catch (err: any) {
    // Trata erros específicos
    if (err.type === "bad_request") {
      return res.status(status.BAD_REQUEST).json({ message: err.message });
    }
    if (err.type === "database_error") {
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }

    // Erro inesperado
    console.error("Erro inesperado:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};

export const getBarber = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Chama a service para buscar todos os barbeiros
    const barbers = await barberService.getAllBarberService();

    // Retorna a resposta com sucesso
    return res.status(status.OK).json(barbers);
  } catch (err) {
    console.error("Erro ao buscar barbeiros:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Falha ao processar os dados dos barbeiros." });
  }
};

export const getBarberById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    // Valida o ID
    if (!validarId(id)) {
      throw errorsUtils.badRequestError("ID fornecido é inválido.");
    }

    // Chama a service para buscar o barbeiro pelo ID
    const barber = await barberService.getBarberServiceById(id);

    // Se o barbeiro não for encontrado
    if (!barber) {
      throw errorsUtils.notFoundError("Barbeiro não encontrado.");
    }

    // Retorna a resposta com sucesso
    return res.status(status.OK).json(barber);
  } catch (err: any) {
    // Trata erros específicos
    if (err.type === "bad_request") {
      return res.status(status.BAD_REQUEST).json({ message: err.message });
    }
    if (err.type === "not_found") {
      return res.status(status.NOT_FOUND).json({ message: err.message });
    }

    // Erro inesperado
    console.error("Erro ao buscar barbeiro:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};

export const putBarber = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const barber = req.body;

    // Valida o ID
    if (!validarId(Number(id))) {
      throw errorsUtils.badRequestError("ID fornecido é inválido.");
    }

    // Chama a service para atualizar o barbeiro
    const updatedBarber = await barberService.updateBarberService(
      Number(id),
      barber
    );

    // Retorna a resposta com sucesso
    return res.status(status.OK).json(updatedBarber);
  } catch (err: any) {
    // Trata erros específicos
    if (err.type === "bad_request") {
      return res.status(status.BAD_REQUEST).json({ message: err.message });
    }
    if (err.type === "not_found") {
      return res.status(status.NOT_FOUND).json({ message: err.message });
    }
    if (err.type === "database_error") {
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }

    // Erro inesperado
    console.error("Erro ao atualizar barbeiro:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};

export const deleteBarber = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    // Valida o ID
    if (!validarId(id)) {
      throw errorsUtils.badRequestError("ID fornecido é inválido.");
    }

    // Chama a service para deletar o barbeiro
    const result = await barberService.deleteBarberService(id);

    if (!result) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Barbeiro não encontrado." });
    }

    // Retorna a resposta com sucesso
    return res.status(status.OK).json({ message: result });
  } catch (err: any) {
    // Trata erros específicos
    if (err.type === "not_found") {
      return res.status(status.NOT_FOUND).json({ message: err.message });
    }
    if (err.type === "database_error") {
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }

    // Erro inesperado
    console.error("Erro ao excluir barbeiro:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};
