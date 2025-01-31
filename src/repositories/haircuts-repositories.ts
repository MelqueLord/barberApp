import { haircutModel } from "../models/haircuts-models";
import sequelize from "../config/db";

export const inserthaircut = async (haircut: haircutModel): Promise<{ id: number }> => {
  const { barbershopId, nome, descricao, preco, duracao, foto } = haircut;

  try {
    // Corrigindo o número de parâmetros na consulta SQL
    const [result]: any = await sequelize.query(
      `INSERT INTO cortes_produtos (barbearia_id, nome, descricao, preco, duracao, foto) 
      VALUES (?, ?, ?, ?, ?, ?)`, {
        replacements: [barbershopId, nome, descricao, preco, duracao, foto],
      }
    );

    // Retorno simplificado com o ID gerado
   
    return { id: result[0]?.id };
  } catch (err) {
    console.error('Erro ao inserir a barbearia:', err);
    throw new Error('Falha ao inserir a barbearia no banco de dados.');
  }

};


export const findAllHaircut = async (): Promise<haircutModel[]> => {
try{
  const [results] : any = await sequelize.query(
    ` SELECT id, 
             barbearia_id, 
             nome, 
             descricao, 
             foto, 
             preco, 
             duracao 
      FROM cortes_produtos`
  );

  return results as haircutModel[];

}catch(err){
console.error('Erro na camada repositories:' , err);
throw new Error("Falha ao buscar os cortes no banco de dados.");
}

}