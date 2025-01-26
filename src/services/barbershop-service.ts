import * as barbershopRepositories from "../repositories/barbershop-repositories";
import { barbershopModel } from "../models/barbershop-models";
import { error } from "console";

export const createBarbershopService = async (
  barbershop: barbershopModel
): Promise<{ id: number }> => {
  try {
    // Lógica de validação
    if (
      !barbershop.nome ||
      !barbershop.endereco ||
      !barbershop.telefone ||
      !barbershop.abertura ||
      !barbershop.fechamento ||
      !barbershop.diaAbertura ||
      !barbershop.diaFechamento
    ) {
      throw new Error("Campos obrigatórios não foram preenchidos.");
    }

    // Chamando o repositório para inserir os dados
    const result = await barbershopRepositories.insertBarbershop(barbershop);

    // Retornando o ID gerado
    return result;
  } catch (err) {
    console.error("Erro ao criar barbearia:", err);
    throw new Error("Falha ao criar barbearia.");
  }
};




/**
 * Serviço para buscar todas as barbearias com formatação personalizada.
 */
export const getAllBarbershopsService = async (): Promise<barbershopModel[]> => {
  try {
    // Obtém os dados do repositório
    const barbershops = await barbershopRepositories.findallBarbershop();

    // Formata os horários no formato 00:00
    const formattedBarbershops = barbershops.map((barbershop) => {
      return {
        ...barbershop,
        abertura: formatTime(barbershop.abertura),
        fechamento: formatTime(barbershop.fechamento),
      };
    });

    // Retorna os dados formatados
    return formattedBarbershops;
  } catch (err) {
    console.error('Erro ao buscar e formatar as barbearias:', err);
    throw new Error('Falha ao processar os dados das barbearias.');
  }
};

/**
 * Formata um horário no formato 00:00.
 * @param time - Horário em string (assumindo formato HH:mm:ss ou HH:mm).
 * @returns Horário formatado no formato 00:00.
 */
const formatTime = (time: string): string => time.slice(0, 5);



/**
 * Serviço para buscar uma barbearia pelo ID com as regras de negócio necessárias.
 * @param id - ID da barbearia
 * @returns - Dados formatados da barbearia
 */
export const getBarbershopByIdService = async (id: number): Promise<barbershopModel> => {
  try {
    
    // Validação de entrada: Verifica se o ID é válido
    if (!id) {
      throw new Error('ID inválido fornecido.');
    }

    // Chama a função do repositório para buscar os dados
    const barbershopById = await barbershopRepositories.findBarbershopById(id);
    

    // Se a barbearia não for encontrada (checando a camada de repositório)
    if (!barbershopById) {
      throw new Error('Barbearia não encontrada.');
    }
     
    
  
    const barbershop = barbershopById;
   

    // Regra de negócio adicional: Formatação de horários no formato "HH:MM"
    const aberturaFormatada = barbershop.abertura.slice(0, 5);
    const fechamentoFormatado = barbershop.fechamento.slice(0, 5);

    // Retornamos os dados com horários formatados
    return {
      ...barbershop,
      abertura: aberturaFormatada,
      fechamento: fechamentoFormatado,
    };
  } catch (err) {
    console.error('Erro no serviço de busca de barbearia pelo ID:', err);
    throw new Error('Erro interno no servidor.');
  }
};


export const updateBarbershopService = async (id: number, barbershop: Partial<barbershopModel>
): Promise<barbershopModel | null> => {
  // Validações de regras de negócio
  if (!id) {
    throw new Error("O ID da barbearia é obrigatório.");
  }

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("O ID deve ser um número inteiro válido.");
  }

  if (!barbershop || Object.keys(barbershop).length === 0) {
    throw new Error("Pelo menos um campo deve ser fornecido para atualização.");
  }

  // Regras adicionais
  if (barbershop.telefone && barbershop.telefone.length !== 11) {
    throw new Error("O telefone deve ter exatamente 11 dígitos.");
  }

  if (barbershop.nome && barbershop.nome.trim().length < 3) {
    throw new Error("O nome da barbearia deve ter pelo menos 3 caracteres.");
  }

  // Chama o repositório para atualizar a barbearia
  return await barbershopRepositories.updateBarbershop(id, barbershop);
};

export const deleteBarbershopService = async (id: number): Promise<string> => {
  // Validação inicial: verifica se o ID foi fornecido
  if (!id) {
    throw new Error("O ID da barbearia é obrigatório.");
  }

  // Validação: o ID deve ser um número inteiro positivo
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("O ID deve ser um número inteiro válido e maior que zero.");
  }

  // Chamada ao repositório para deletar a barbearia
  const result = await barbershopRepositories.deleteBarbershop(id);

  // Retorna a mensagem de sucesso
  return result;
};
