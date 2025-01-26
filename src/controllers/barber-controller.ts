import {createBarberService} from  "../services/barber-service";
import status from "http-status";
import {Request, Response} from "express";


export const postBarber = async (req: Request, res: Response): Promise<Response>  =>{
try{

    const file = req.file;
    const barber = req.body;
   
      if(!file){
       throw new Error("Foto é obrigatória");
      }
      
      const fotoBuffer = file.buffer;
   
      const result = await createBarberService(barber, fotoBuffer);
    
  
   return res.status(status.OK).json({
    message: "Barbeiro criado com sucesso!",
    data: result,
  }); 
   
} catch(err: any){
  console.error(err);
  return res.status(status.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Erro ao criar barbeiro.",
  });

}
}