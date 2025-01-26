import { Request, Response } from "express";
import { createHaircutService } from "../services/haircut-service";
import status from "http-status"; // Usando toda a biblioteca http-status

export const postHaircut = async (req: Request, res: Response): Promise<Response> => {
  try {
    const file = req.file; // Arquivo recebido via Multer
    const haircut = req.body; // Dados do corpo da requisição


     
    if (!file) {
      throw new Error("Foto é obrigatória.");
    }

   // Aqui você pode transformar o arquivo em um buffer, caso necessário
   const fotoBuffer = file.buffer; // Multer já coloca o arquivo em buffer se você usar memoryStorage



    // Chama o serviço para criar o corte de cabelo
    const result = await createHaircutService(haircut, fotoBuffer);

    return res.status(status.OK).json({
      message: "Corte de cabelo criado com sucesso!",
      data: result,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      message: err.message || "Erro ao criar corte de cabelo.",
    });
  }
};
