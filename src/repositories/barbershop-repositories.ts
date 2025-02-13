import { barbershopModel } from "../models/barbershop-models";
import sequelize from "../config/db"; // Configuração do banco de dados

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
export const insertBarbershop = async (
  barbershop: barbershopModel
): Promise<{ id: number }> => {
  const {
    nome,
    endereco,
    telefone,
    diaAbertura,
    diaFechamento,
    abertura,
    fechamento,
  } = barbershop;

  // Inserção utilizando Sequelize (usando query genérica sem QueryTypes)
  const [result]: any = await sequelize.query(
    `
      INSERT INTO Barbearias (nome, endereco, telefone, dia_abertura, dia_fechamento, abertura, fechamento) 
      VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
    {
      replacements: [
        nome,
        endereco,
        telefone,
        diaAbertura,
        diaFechamento,
        abertura,
        fechamento,
      ],
    }
  );

  const [idResult]: any = await sequelize.query(
    `SELECT LAST_INSERT_ID() AS id`
  );
  return { id: idResult[0]?.id };
};

export const findallBarbershop = async (): Promise<barbershopModel[]> => {
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
};

/**
 * Função para buscar uma barbearia pelo ID no banco de dados.
 * @param id - ID da barbearia
 * @returns - Dados da barbearia ou lança erro caso não encontrada
 */
export const findBarbershopById = async (
  id: number
): Promise<barbershopModel | null> => {
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

  // Retorna o único resultado encontrado
  return result?.length ? result[0] : null; // Retorna null ao invés de lançar erro
};

export const updateBarbershop = async (
  id: number,
  barbershop: Partial<barbershopModel>
): Promise<barbershopModel | null> => {
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

  // Executa a query
  const [result]: any = await sequelize.query(query, {
    replacements: [...values, id], // Substitui os placeholders pelos valores e ID
  });

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
  return result.affectedRows ? findBarbershopById(id) : null;
};

export const deleteBarbershop = async (id: number): Promise<boolean> => {
  const query = `DELETE FROM Barbearias WHERE id = ?`;

  const [result]: any = await sequelize.query(query, {
    replacements: [id],
  });

  return result[0].affectedRows > 0; // Retorna `true` se deletou, `false` se não encontrou
};
