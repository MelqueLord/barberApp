import {barberModel} from "../models/barber-models";
import sequelize from "../config/db";

export const insertBarber = async (barber:barberModel): Promise<{ id: number }> =>{
 const{nome, barbeariaId, especialidade, telefone, fotoBarbeiro} = barber;
 try{
     const[result]: any = await sequelize.query( `INSERT INTO barbeiros(nome, barbearia_id, especialidade, telefone, foto_barbeiro) 
      VALUES (?, ?, ?, ?, ?)`, {
        replacements: [nome, barbeariaId, especialidade, telefone, fotoBarbeiro ],
      }

    );

    
    return {id: result[0]?.id };
  } catch (err) {
    console.error('Erro ao inserir a barbeiro:', err);
    throw new Error('Falha ao inserir a barbeiro no banco de dados.');
  }

};
