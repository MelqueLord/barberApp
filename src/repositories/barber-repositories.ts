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

    return { id: result[0]?.id };
  } catch (err) {
    console.error("Erro ao inserir a barbeiro:", err);
    throw new Error("Falha ao inserir a barbeiro no banco de dados.");
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
    throw new Error("Falha ao buscar as barbeiros no banco de dados.");
  }
};
