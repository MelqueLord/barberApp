import * as haircutRepositories from "../repositories/haircuts-repositories";
import { haircutModel } from "../models/haircuts-models";

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
    console.error("Erro ao criar barbearia:", err);
    throw new Error("Falha ao criar barbearia.");
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