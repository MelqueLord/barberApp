import { Request, Response } from "express";
import * as haircutService from "../services/haircut-service";
import status from "http-status"; // Usando toda a biblioteca http-status
import {ERROR_MESSAGES} from "../utils/ErrorsControllers";
import {validarId} from "../utils/validateId";
import { updateHaircut } from "../repositories/haircuts-repositories";

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
    const result = await haircutService.createHaircutService(haircut, fotoBuffer);

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


export const getHaircut = async (req: Request, res: Response): Promise<void> =>{
try{
const haircuts = await haircutService.getAllHaircutService();
res.status(status.OK).json(haircuts);

}catch(err){
 console.error('Erro no controller de cortes de cabelo', err);
 res.status(status.INTERNAL_SERVER_ERROR).json({message: ERROR_MESSAGES.INTERNAL_ERROR});
}

} 

export const getHaircutById = async (req: Request, res:Response): Promise<void> => {
try{
  const id = Number(req.params.id);
   
  if(!validarId(id)){
    res.status(status.BAD_REQUEST).json({message:'ID Fornecido invalido'});
    return;
  }
  
  const haircut = await haircutService.getHaircutServiceById(id);
  
  if(!haircut){
    res.status(status.NOT_FOUND).json({message:'Corte não encontrado'});
    return;
   }

   res.status(status.OK).json(haircut);

  }catch(err){
   console.error('Erro no controller do corte' , err);
   res.status(status.INTERNAL_SERVER_ERROR).json({message:'Erro Interno do servidor'});

  }

}

export const putHaircut = async (req: Request, res:Response): Promise<void> =>{
try{


 const id = validarId(Number(req.params.id));
 const haircut = req.body;

 if(!haircut || Object.keys(haircut).length===0){
  throw new Error('Nenhum dado para atualizar foi fornecido');
}

 const updateHaircut = await haircutService.updateHaircutService(id, haircut);
 res.status(status.OK).json(updateHaircut);

}catch(err: any){
  console.error("Erro no controller ao atualizar barbeiro:", err.message);

  // Erros específicos de negócio
  if (err.message === "ID inválido fornecido") {
     res.status(status.BAD_REQUEST).json({ message: err.message });
  }
  if (err.message === "Nenhum dado para atualizar foi fornecido") {
    res.status(status.BAD_REQUEST).json({ message: err.message });
  }
  if (err.message === "Campos inválidos fornecidos") {
    res.status(status.BAD_REQUEST).json({ message: err.message });
  }
  if (err.message === "Corte não encontrado") {
     res.status(status.NOT_FOUND).json({ message: err.message });
  }

 // Erros genéricos do servidor
 res.status(status.INTERNAL_SERVER_ERROR).json({ message: "Erro ao atualizar Corte." });
}

};


