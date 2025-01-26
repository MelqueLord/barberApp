import {barberModel} from "../models/barber-models";
import {insertBarber} from "../repositories/barber-repositories";

export const createBarberService = async (barber:barberModel, fotoBuffer: Buffer): Promise<{id:number}> =>{

  const {barbeariaId, nome, especialidade, telefone} = barber; 
  
  try{
     if(!barbeariaId || !nome || !especialidade || !telefone || !fotoBuffer){
        throw new Error("Campos obrigatórios não foram preenchidos.");
     }

      // Crie o objeto completo, incluindo a foto no formato buffer
     const barbertWithFoto = {
        ...barber,
        fotoBarbeiro: fotoBuffer, // A foto está no formato buffer aqui
      };

      const result = await insertBarber(barbertWithFoto);

       return result;
  }catch(err){
    console.error("Erro ao barbeiro:", err);
    throw new Error("Falha ao criar barbeiro.");
  }
    
}