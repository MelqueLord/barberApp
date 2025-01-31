import { barberModel } from "../models/barber-models";
import * as barberRepositories from "../repositories/barber-repositories";
import {validarId} from "../utils/validateId";

export const createBarberService = async (
  barber: barberModel,
  fotoBuffer: Buffer
): Promise<{ id: number }> => {
  const { barbeariaId, nome, especialidade, telefone } = barber;

  try {
    if (!barbeariaId || !nome || !especialidade || !telefone || !fotoBuffer) {
      throw new Error("Campos obrigatórios não foram preenchidos.");
    }

    // Crie o objeto completo, incluindo a foto no formato buffer
    const barbertWithFoto = {
      ...barber,
      fotoBarbeiro: fotoBuffer, // A foto está no formato buffer aqui
    };

    const result = await barberRepositories.insertBarber(barbertWithFoto);

    return result;
  } catch (err) {
    console.error("Erro ao barbeiro:", err);
    throw new Error("Falha ao criar barbeiro.");
  }
};

export const getAllBarberService = async (): Promise<barberModel[]> => {
  try {
    const barbers = await barberRepositories.findAllBarber();

    return barbers;
  } catch (err) {
    console.error("Erro ao buscar Barbearias:", err);
    throw new Error("Falha ao processar os dados dos barbeiros.");
  }
};

export const getBarberServiceById = async (id: number): Promise<barberModel | null> =>{
try{
     
   const idBarber = validarId(id);
  
  //if(!id || id<= 0 || isNaN(id)){
      //throw new Error('ID inválido fornecido.');'

     //}
     
     
     const barberById = await barberRepositories.findBarberById(idBarber);

     // joguei null para o controller decidir como fazrer
     if(!barberById){
      return null;
     }

    return barberById;
     
}catch(err: any){
 console.error('Erro no serviço de busca de barbearia pelo ID:', err);
 throw new Error(err.message || 'Erro interno no servidor.');
}

}

export const updateBarberService = async (
  id: number,
  barber: Partial<barberModel>
): Promise<barberModel | null> => {
  try {
    
    const idBarber = validarId(id);

    // Regra de negócio 2: Garantir que pelo menos um campo seja atualizado
    if (!barber || Object.keys(barber).length === 0) {
      throw new Error("Nenhum dado para atualizar foi fornecido");
    }

    // Regra de negócio 3: Garantir que os campos enviados sejam válidos
    const validFields = ["nome", "barbeariaId", "especialidade", "telefone", "fotoBarbeiro"];
    const invalidFields = Object.keys(barber).filter(
      (key) => !validFields.includes(key)
    );

    if (invalidFields.length > 0) {
      throw new Error(`Campos inválidos fornecidos: ${invalidFields.join(", ")}`);
    }

    // Regra de negócio 4: Verificar se o barbeiro existe antes de atualizar
    const existingBarber = await barberRepositories.findBarberById(idBarber);
    if (!existingBarber) {
      throw new Error("Barbeiro não encontrado");
    }

    // Chamar o repositório para atualizar o barbeiro
    const updatedBarber = await barberRepositories.updateBarber(idBarber, barber);

    // Verificar se a atualização foi bem-sucedida
    if (!updatedBarber) {
      throw new Error("Falha ao atualizar o barbeiro");
    }

    return updatedBarber;
  } catch (err: any) {
    console.error("Erro no serviço de atualizar barbeiro:", err.message);
    throw new Error(err.message || "Erro no serviço de atualização");
  }
};

export const deleteBarberService = async (id: number): Promise<string>=> {
try{
const idBarber = validarId(id);
const result = await barberRepositories.deleteBarber(idBarber);

return result;

}catch(err){
console.error('Nao foi possivel excluir:', err );
throw new Error('Erro ao deletar barbeiro');
}

}