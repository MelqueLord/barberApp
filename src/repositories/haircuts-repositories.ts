import { haircutModel } from "../models/haircuts-models";
import sequelize from "../config/db";

export const inserthaircut = async (
  haircut: haircutModel
): Promise<{ id: number }> => {
  const { barbershopId, nome, descricao, preco, duracao, foto } = haircut;

  try {
    // Corrigindo o número de parâmetros na consulta SQL
    const [result]: any = await sequelize.query(
      `INSERT INTO cortes_produtos (barbearia_id, nome, descricao, preco, duracao, foto) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: [barbershopId, nome, descricao, preco, duracao, foto],
      }
    );

    // Retorno simplificado com o ID gerado

    return { id: result[0]?.id };
  } catch (err) {
    console.error("Erro ao inserir a barbearia:", err);
    throw new Error("Falha ao inserir a barbearia no banco de dados.");
  }
};

export const findAllHaircut = async (): Promise<haircutModel[]> => {
  try {
    const [results]: any = await sequelize.query(
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
  } catch (err) {
    console.error("Erro na camada repositories:", err);
    throw new Error("Falha ao buscar os cortes no banco de dados.");
  }
};

export const findHaircutById = async(id: number): Promise<haircutModel | null> =>{
  try{
 const query = ` 
       SELECT id, 
             barbearia_id, 
             nome, 
             descricao, 
             foto, 
             preco, 
             duracao 
      FROM cortes_produtos
      WHERE id= ?`;
      
      const [result]: any = await sequelize.query(query, {
        replacements: [id],
      });

      // Verifica se a consulta retornou resultados
    if (!result || result.length === 0) {
      throw new Error("Corte de cabelo não encontrada");
    }

    // Retorna o único resultado encontrado
    return result[0];

  }catch(err){
    console.error("Erro ao buscar corte de cabelo pelo ID:", err);
    throw new Error("Falha ao buscar corte pelo ID");

  }

}

export const updateHaircut = async (id: number, haircut: Partial<haircutModel>): Promise<haircutModel | null> =>{
try{
   // Verifica se há campos para atualizar
   if (Object.keys(haircut).length === 0) {
    throw new Error("Nenhum campo válido para atualização foi fornecido.");
  }
   
  const fields = Object.keys(haircut)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(haircut);

    const [result]: any = await sequelize.query(
      `UPDATE cortes_produtos SET ${fields} WHERE id = ?`,
      {
        replacements: [...values, id],
      }
    );

    // Verifique se a atualização afetou alguma linha
    if (result.affectedRows === 0) {
      throw new Error("Nenhum barbeiro encontrado para atualizar");
    }
    // Retorne o barbeiro atualizado
        const updatedHaircut = await findHaircutById(id);
        return updatedHaircut;
    

}catch(err){
console.error('Erro no Repositories de Haircuts' ,err);
throw new Error('Erro ao atualizar corte de cabelo');

}

}

export const deleteHaircut = async (id:number): Promise<string> =>{
  try{
    const query = `
      DELETE FROM cortes_produtos
      WHERE id = ?
    `;
  
    const[result]: any = await sequelize.query(query, { replacements:[id]});
    
    if(result.affectedRows===0){
      throw new Error("Nenhuma barbearia encontrada com o ID fornecido.");
   
       }

       return "Corte de cabelo deletado com sucesso!";
  }catch(err){
    console.error('Erro ao deletar Barbearia:' , err);
    throw new Error('Falha ao deletar a barbearia.');

  }

}