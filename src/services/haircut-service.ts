import * as haircutRepositories from "../repositories/haircuts-repositories";
import { haircutModel } from "../models/haircuts-models";
import { getHaircut } from "../controllers/haircuts-controller";
import { validarId } from "../utils/validateId";

export const createHaircutService = async (
  haircut: haircutModel, fotoBuffer: Buffer
): Promise<{ id: number }> => {
  const { barbershopId, nome, descricao, preco, duracao } = haircut;

  try {
    if (!barbershopId || !nome || !descricao || !preco || !duracao || !fotoBuffer) {
      throw new Error("Campos obrigatórios não foram preenchidos.");
    }
    
     // Crie o objeto completo, incluindo a foto no formato buffer
     const haircutWithFoto = {
        ...haircut,
        foto: fotoBuffer, // A foto está no formato buffer aqui
      };

    
    
    
    // Chamando o repositório para inserir os dados
    const result = await haircutRepositories.inserthaircut(haircutWithFoto);

    //retorna o id gerado
    return result;
  } catch (err) {
    console.error("Erro na service de corte:", err);
    throw new Error("Falha ao criar corte de cabelo.");
  }
};

export const getAllHaircutService = async (): Promise<haircutModel[]> => {
try{
 const haircuts = await haircutRepositories.findAllHaircut();

 
 return haircuts; 

}catch(err){
console.error('Erro na camada Service ao consultar cortes:', err);
throw new Error('Falha ao processar os dados dos cortes');
}

}

export const getHaircutServiceById = async (id:number): Promise<haircutModel | null> => {
  try{
  const idHaircut = validarId(id);

  const haircut = await haircutRepositories.findHaircutById(idHaircut);
   if(!haircut)
    throw new Error('Corte não encontrado.');
    
   return haircut;
  }catch(err){
   console.error('Erro no service de corte', err);
   throw new Error("Erro ao tentar encontrar corte");
  }

} 