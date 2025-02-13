import { barberModel } from "../models/barber-models";
import sequelize from "../config/db";

export const insertBarber = async (
  barber: barberModel
): Promise<{ id: number }> => {
  const { nome, barbeariaId, especialidade, telefone, fotoBarbeiro } = barber;

  const [result]: any = await sequelize.query(
    `INSERT INTO barbeiros(nome, barbearia_id, especialidade, telefone, foto_barbeiro) 
    VALUES (?, ?, ?, ?, ?)`,
    {
      replacements: [nome, barbeariaId, especialidade, telefone, fotoBarbeiro],
    }
  );

  return { id: result[0]?.id };
};

export const findAllBarber = async (): Promise<barberModel[]> => {
  const [results]: any = await sequelize.query(`
    SELECT id, nome, barbearia_id, especialidade, telefone, foto_barbeiro
    FROM barbeiros
  `);
  return results as barberModel[];
};

export const findBarberById = async (
  id: number
): Promise<barberModel | null> => {
  const query = `
    SELECT id, nome, barbearia_id, especialidade, telefone, foto_barbeiro
    FROM barbeiros
    WHERE id = ?
  `;

  const [result]: any = await sequelize.query(query, { replacements: [id] });

  return result.length ? result[0] : null;
};

export const updateBarber = async (
  id: number,
  barber: Partial<barberModel>
): Promise<barberModel | null> => {
  if (Object.keys(barber).length === 0) {
    throw new Error("Nenhum campo fornecido para atualização.");
  }

  const fields = Object.keys(barber)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(barber);

  const [result]: any = await sequelize.query(
    `UPDATE barbeiros SET ${fields} WHERE id = ?`,
    { replacements: [...values, id] }
  );

  return result.affectedRows ? findBarberById(id) : null;
};

export const deleteBarber = async (id: number): Promise<boolean> => {
  const query = `DELETE FROM barbeiros WHERE id = ?`;

  const [result]: any = await sequelize.query(query, { replacements: [id] });

  return result.affectedRows > 0;
};
