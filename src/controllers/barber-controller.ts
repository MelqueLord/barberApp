import * as barberService from "../services/barber-service";
import status from "http-status";
import { Request, Response } from "express";
import {validarId} from "../utils/validateId";
import * as errorsUtils from "../utils/errorsUtils";


export const postBarber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;
    const barber = req.body;

    if (!file) {
      throw errorsUtils.badRequestError("Foto é obrigatória.");
      }

    const fotoBuffer = file.buffer;

    const newBarber = await barberService.createBarberService(barber, fotoBuffer);

    res.status(status.OK).json(newBarber);
  } catch (err:any) {
    if (err.type === "bad_request") {
       res.status(400).json({ message: err.message });
    }

   
    if (err.type === "database_error") {
       res.status(500).json({ message: err.message });
    }

    console.error("Erro inesperado:", err);
     res.status(500).json({ message: "Erro interno do servidor." });
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
   
   if(!validarId(id)){
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

export const deleteBarber = async (req: Request, res:Response): Promise<void> => {
try{
  const id = validarId(Number(req.params.id));

  const result = await barberService.deleteBarberService(id);

  if(result){
    res.status(status.OK).json({message: result});
  }else{
    res.status(status.NOT_FOUND).json({message:'Barbeiro nao encontrado'});
  }
  
    

}catch(err){
  console.error('Erro ao excluir barbeiro no controller:' , err);
  res.status(status.INTERNAL_SERVER_ERROR).json({message:'Erro ao tentar excluir Barbeiro'})
}

}
