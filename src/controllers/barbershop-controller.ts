import { Request, Response } from "express";
import status from "http-status";
import * as barbershopService from "../services/barbershop-service";
import { validarId } from "../utils/validateId";
import * as errorsUtils from "../utils/errorsUtils";

export const postBarbershop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const barbershop = req.body;

    // Validação de dados obrigatórios
    if (
      !barbershop.nome ||
      !barbershop.telefone ||
      !barbershop.endereco ||
      !barbershop.diaAbertura ||
      !barbershop.diaFechamento ||
      !barbershop.abertura ||
      !barbershop.fechamento
    ) {
      throw errorsUtils.badRequestError("Dados obrigatórios não preenchidos.");
    }

    // Chama a service para criar a barbearia
    const newBarbershop = await barbershopService.createBarbershopService(
      barbershop
    );
    return res.status(status.CREATED).json(newBarbershop);
  } catch (err: any) {
    if (err.type === "bad_request") {
      return res.status(status.BAD_REQUEST).json({ message: err.message });
    }
    console.error("Erro inesperado:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};

export const getBarbershops = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const barbershops = await barbershopService.getAllBarbershopsService();
    return res.status(status.OK).json(barbershops);
  } catch (err) {
    console.error("Erro ao buscar barbearias:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Falha ao processar os dados das barbearias." });
  }
};

export const getBarbershopById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    if (!validarId(id)) {
      throw errorsUtils.badRequestError("ID fornecido é inválido.");
    }

    const barbershop = await barbershopService.getBarbershopByIdService(id);
    if (!barbershop) {
      throw errorsUtils.notFoundError("Barbearia não encontrada.");
    }

    return res.status(status.OK).json(barbershop);
  } catch (err: any) {
    if (err.type === "bad_request") {
      res.status(status.BAD_REQUEST).json({ message: err.message });
    }
    if (err.type === "not_found") {
      return res.status(status.NOT_FOUND).json({ message: err.message });
    }
    console.error("Erro ao buscar barbearia:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};

export const putBarbershop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const barbershop = req.body;

    if (!validarId(id)) {
      throw errorsUtils.badRequestError("ID fornecido é inválido.");
    }

    const updatedBarbershop = await barbershopService.updateBarbershopService(
      id,
      barbershop
    );
    return res.status(status.OK).json(updatedBarbershop);
  } catch (err: any) {
    if (err.type === "bad_request") {
      return res.status(status.BAD_REQUEST).json({ message: err.message });
    }
    if (err.type === "not_found") {
      return res.status(status.NOT_FOUND).json({ message: err.message });
    }
    console.error("Erro ao atualizar barbearia:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};

export const deleteBarbershop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    if (!validarId(id)) {
      throw errorsUtils.badRequestError("ID fornecido é inválido.");
    }

    const result = await barbershopService.deleteBarbershopService(id);
    if (!result) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Barbearia não encontrada." });
    }

    return res.status(status.OK).json({ message: result });
  } catch (err: any) {
    if (err.type === "not_found") {
      res.status(status.NOT_FOUND).json({ message: err.message });
    }
    console.error("Erro ao excluir barbearia:", err);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro interno do servidor." });
  }
};
