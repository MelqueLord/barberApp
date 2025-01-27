import { barbershopModel } from '../models/barbershop-models';
import sequelize from '../config/db'; // Configuração do banco de dados


// Mapeamento entre a interface e o banco de dados
const columnMap: { [key: string]: string } = {
  nome: "nome",
  telefone: "telefone",
  endereco: "endereco",
  diaAbertura: "dia_abertura",
  diaFechamento: "dia_fechamento",
  abertura: "abertura",
  fechamento: "fechamento",
};



// Função de inserção no repositório
export const insertBarbershop = async (barbershop: barbershopModel): Promise<{ id: number }> => {
  const { nome, endereco, telefone, diaAbertura, diaFechamento, abertura, fechamento } = barbershop;

  try {
    // Inserção utilizando Sequelize (usando query genérica sem QueryTypes)
    const [result]: any = await sequelize.query(
      `
      INSERT INTO Barbearias (nome, endereco, telefone, dia_abertura, dia_fechamento, abertura, fechamento) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      {
        replacements: [nome, endereco, telefone, diaAbertura, diaFechamento, abertura, fechamento],
      }
    );

    // Retorno simplificado com o ID gerado
   
    return { id: result[0]?.id };
  } catch (err) {
    console.error('Erro ao inserir a barbearia:', err);
    throw new Error('Falha ao inserir a barbearia no banco de dados.');
  }
};

export const findallBarbershop = async (): Promise<barbershopModel[]> => {
  try {
    // Consulta SQL para buscar todas as barbearias
    const [results]: any = await sequelize.query(
      `
      SELECT id, 
             nome, 
             endereco, 
             telefone, 
             dia_abertura AS diaAbertura, 
             dia_fechamento AS diaFechamento, 
             abertura, 
             fechamento 
      FROM Barbearias
      `
    );

    // Garante o retorno no formato da interface
    return results as barbershopModel[];
  } catch (err) {
    console.error('Erro ao buscar as barbearias:', err);
    throw new Error('Falha ao buscar as barbearias no banco de dados.');
  }
};

 
  
/**
 * Função para buscar uma barbearia pelo ID no banco de dados.
 * @param id - ID da barbearia
 * @returns - Dados da barbearia ou lança erro caso não encontrada
 */
export const findBarbershopById = async (id: number): Promise<barbershopModel | null> => {
  try {
    // Executa a consulta no banco de dados com segurança usando parâmetro substituível
    
    
    const query = `
      SELECT id, 
             nome, 
             endereco, 
             telefone, 
             dia_abertura AS diaAbertura, 
             dia_fechamento AS diaFechamento, 
             abertura, 
             fechamento 
      FROM Barbearias
      WHERE id = ?
    `;
    
    const [result]: any = await sequelize.query(query, {
      replacements: [id], // Substitui ? pela variável id
       
    });
   
    // Verifica se a consulta retornou resultados
    if (!result || result.length === 0) {
      throw new Error('Barbearia não encontrada');
    }

    // Retorna o único resultado encontrado
    return result[0]; // Retorna um único objeto de barbearia
  } catch (err) {
    console.error('Erro ao buscar barbearia pelo ID:', err);
    throw new Error('Falha ao buscar barbearia pelo ID');
  }
};




export const updateBarbershop = async (id: number, barbershop: Partial<barbershopModel>):
 Promise<barbershopModel | null> => {
  try {
    // Validações iniciais
    if (!id) {
      throw new Error("ID inválido fornecido.");
    }

    if (Object.keys(barbershop).length === 0) {
      throw new Error("Nenhum campo fornecido para atualização.");
    }

    // Criação dinâmica da query de atualização
    const fields = Object.keys(barbershop); // Pega as chaves (campos a serem atualizados)
    const values = Object.values(barbershop); // Pega os valores correspondentes



   // Mapeia os campos para os nomes das colunas no banco
   const setClause = fields
   .map((field) => {
     const columnName = columnMap[field]; // Obtém o nome da coluna no banco
     if (!columnName) {
       throw new Error(`Campo inválido: ${field}`);
     }
     return `${columnName} = ?`;
   })
   .join(", ");



    const query = `
      UPDATE Barbearias
      SET ${setClause}
      WHERE id = ?
    `;
      
    console.log("Query da service:", query);

    // Executa a query
    const [result]: any = await sequelize.query(query, {
      replacements: [...values, id], // Substitui os placeholders pelos valores e ID
    });

    // Verifica se algum registro foi afetado
    if (result.affectedRows === 0) {
      throw new Error("Nenhuma barbearia encontrada com o ID fornecido.");
    }

    // Busca a barbearia atualizada para retornar
    const [updatedBarbershop]: any = await sequelize.query(
      `
      SELECT id, 
             nome, 
             endereco, 
             telefone, 
             dia_abertura AS diaAbertura, 
             dia_fechamento AS diaFechamento, 
             abertura, 
             fechamento
      FROM Barbearias
      WHERE id = ?
    `,
      { replacements: [id] }
    );

    // Retorna os dados da barbearia atualizada
    return updatedBarbershop[0] || null;
  } catch (err) {
    console.error("Erro ao atualizar barbearia:", err);
    throw new Error("Falha ao atualizar a barbearia.");
  }
};


export const deleteBarbershop = async (id: number): Promise<string> => {
  try {
    // Validação inicial para verificar se o ID foi fornecido
    if (!id) {
      throw new Error("ID inválido fornecido.");
    }

    // Query SQL para deletar uma barbearia com base no ID
    const query = `
      DELETE FROM Barbearias
      WHERE id = ?
    `;

    // Executando a query com o ID fornecido
    const [result]: any = await sequelize.query(query, {
      replacements: [id], // Substitui o placeholder (?) pelo ID fornecido
    });

    // Verifica se alguma linha foi afetada (ou seja, deletada)
    if (result.affectedRows === 0) {
      throw new Error("Nenhuma barbearia encontrada com o ID fornecido.");
    }

    // Retorna uma mensagem de sucesso
    return "Barbearia deletada com sucesso!";
  } catch (err) {
    // Tratamento de erros e logging
    console.error("Erro ao deletar barbearia:", err);
    throw new Error("Falha ao deletar a barbearia.");
  }
};
