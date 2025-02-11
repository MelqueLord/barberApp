import { barberModel } from "../models/barber-models";
import sequelize from "../config/db";

export const insertBarber = async (
  barber: barberModel
): Promise<{ id: number }> => {
  const { nome, barbeariaId, especialidade, telefone, fotoBarbeiro } = barber;
  try {
    const [result]: any = await sequelize.query(
      `INSERT INTO barbeiros(nome, barbearia_id, especialidade, telefone, foto_barbeiro) 
      VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: [
          nome,
          barbeariaId,
          especialidade,
          telefone,
          fotoBarbeiro,
        ],
      }
    );
    // Verifica se a operação retornou um ID válido
    if (!result || !result[0]?.id) {
      throw new Error("Falha ao inserir o barbeiro no banco de dados.");
    }

    return { id: result[0]?.id };
  } catch (err) {
    // Lança o erro para ser tratado pela camada superior (service)
    console.error("Erro ao inserir barbeiro:", err);
    throw err; // Repassa o erro para a camada service
  }
};

export const findAllBarber = async (): Promise<barberModel[]> => {
  try {
    const [results]: any = await sequelize.query(
      `SELECT
           id,
           nome,
           barbearia_id,
           especialidade,
           telefone,
           foto_barbeiro
           FROM
           barbeiros
           `
    );

    // Garante o retorno no formato da interface
    return results as barberModel[];
  } catch (err) {
    console.error("Erro ao consultar Barbeiros:", err);
    throw err;
  }
};

export const findBarberById = async (
  id: number
): Promise<barberModel | null> => {
  try {
    const query = `SELECT
         id,
         nome,
         barbearia_id,
         especialidade,
         telefone,
         foto_barbeiro
         FROM
         barbeiros
         WHERE id = ?
         `;

    const [result]: any = await sequelize.query(query, {
      replacements: [id],
    });
    // Verifica se a consulta retornou resultados
    if (!result || result.length === 0) {
      throw new Error("Barbearia não encontrada");
    }

    // Retorna o único resultado encontrado
    return result[0];
  } catch (err) {
    console.error("Erro ao buscar barbeiro pelo ID:", err);
    throw err;
  }
};

export const updateBarber = async (
  id: number,
  barber: Partial<barberModel>
): Promise<barberModel | null> => {
  try {
    if (Object.keys(barber).length === 0) {
      throw new Error("Nenhum campo para atualizar foi fornecido");
    }

    const fields = Object.keys(barber)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(barber);

    const [result]: any = await sequelize.query(
      `UPDATE barbeiros SET ${fields} WHERE id = ?`,
      {
        replacements: [...values, id],
      }
    );

    // Verifique se a atualização afetou alguma linha
    if (result.affectedRows === 0) {
      throw new Error("Nenhum barbeiro encontrado para atualizar");
    }

    // Retorne o barbeiro atualizado
    const updatedBarber = await findBarberById(id);
    return updatedBarber;
  } catch (err) {
    console.error("Erro ao atualizar barbeiro:", err);
    throw err;
  }
};

export const deleteBarber = async (id: number): Promise<string> => {
  try {
    const query = `
      DELETE FROM Barbeiros
      WHERE id = ?
    `;

    const [result]: any = await sequelize.query(query, {
      replacements: [id],
    });

    if (result.affectedRows === 0) {
      throw new Error("Nenhuma barbearia encontrada com o ID fornecido.");
    }

    return "Barbearia deletada com sucesso!";
  } catch (err) {
    console.error("Erro ao deletar Barbearia:", err);
    throw err;
  }
};
