import * as barberService from "../services/barber-service";
import status from "http-status";
import { Request, Response } from "express";
import { stat } from "fs";


export const postBarber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;
    const barber = req.body;

    if (!file) {
      res.status(400).json({ message: "Foto é obrigatória" });
      return;
    }

    const fotoBuffer = file.buffer;

    const result = await barberService.createBarberService(barber, fotoBuffer);

    res.status(status.OK).json({
      message: "Barbeiro criado com sucesso!",
      data: result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: err.message || "Erro ao criar barbeiro.",
    });
  }
};

export const getBarber = async (req: Request, res: Response): Promise<void> => {
  try {
    // Chama a função do serviço para buscar
    const barbers = await barberService.getAllBarberService();

    // Retorna a resposta com sucesso
    res.status(status.OK).json(barbers);
  } catch (err) {
    console.error("Erro ao buscar barbearias", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Falha ao processar Barbearias" });
  }
};

export const getBarberById = async (req: Request, res: Response): Promise<void> => {
 try{
  const id = Number(req.params.id);
   
   if(isNaN(id) || id<=0){
    res.status(status.BAD_REQUEST).json({message:'Id Fornecido Invalido'});
    return;  // para a função finalizar aqui
   }
  const barber = await barberService.getBarberServiceById(id);

   if(!barber){
    res.status(status.NOT_FOUND).json({message:'Barbeiro não encontrado'});
    return;
   }

   res.status(status.OK).json(barber);
 }catch(err){
 console.error('Erro ao buscar barbeiro:', err);  
 res.status(status.INTERNAL_SERVER_ERROR).json({message:'Erro interno do servidor'});

 }

}


export const putBarber = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrai o ID e os dados do barbeiro do request
    const { id } = req.params;
    const barber = req.body;

    // Chama o serviço para processar a atualização
    const updatedBarber = await barberService.updateBarberService(Number(id), barber);

    // Retorna a resposta com os dados atualizados
    res.status(status.OK).json(updatedBarber);
  } catch (error: any) {
    console.error("Erro no controller ao atualizar barbeiro:", error.message);

    // Erros específicos de negócio
    if (error.message === "ID inválido fornecido") {
       res.status(status.BAD_REQUEST).json({ message: error.message });
    }
    if (error.message === "Nenhum dado para atualizar foi fornecido") {
      res.status(status.BAD_REQUEST).json({ message: error.message });
    }
    if (error.message === "Campos inválidos fornecidos") {
      res.status(status.BAD_REQUEST).json({ message: error.message });
    }
    if (error.message === "Barbeiro não encontrado") {
       res.status(status.NOT_FOUND).json({ message: error.message });
    }

    // Erros genéricos do servidor
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: "Erro ao atualizar barbeiro." });
  }
};

