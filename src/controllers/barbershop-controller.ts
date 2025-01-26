import { Request, Response } from 'express';
import status from "http-status"; // Biblioteca statuscode
import * as BarbershopService from '../services/barbershop-service';



export const postBarbershop = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('Recebendo dados da requisição:', req.body);
    const barbershop = req.body;

    // Chamando o serviço para criar a barbearia
    const result = await BarbershopService.createBarbershopService(barbershop);
    console.log('Barbearia criada:', barbershop);
    // Retornando resposta de sucesso com código 201 (Created)
    return res.status(status.CREATED).json({
      message: 'Barbearia criada com sucesso!',
      data: result,
    });
  } catch (err: any) {
    console.error('Erro no controller:', err);

    // Retornando erro com mensagem e código 400 (ou 500 para erros inesperados)
    const statusCode = err.message.includes('Campos obrigatórios') 
      ? status.BAD_REQUEST 
      : status.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      message: err.message || 'Erro interno no servidor.',
    });
  }
};


/**
 * Controller para buscar todas as barbearias
 */
export const getBarbershops = async (req: Request, res: Response): Promise<void> => {
  try {
    // Chama a função do serviço para buscar as barbearias
    const barbershops = await BarbershopService.getAllBarbershopsService();

    // Retorna a resposta com sucesso (status 200) e os dados
    res.status(status.OK).json(barbershops);
  } catch (err) {
    // Se ocorrer erro, retorna um erro com status 500 (Erro Interno do Servidor)
    console.error('Erro ao buscar barbearias:', err);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'Falha ao processar os dados das barbearias',
    });
  }
};

export const getBarbershopById = async (req: Request, res: Response): Promise<void> =>{
 try{
     const id = Number(req.params.id);
     console.log('ID:', id );

      if(isNaN(id) || id<=0){
        res.status(status.BAD_REQUEST).json({message:'Id informado inválido'})
      }


     const barbershop = await BarbershopService.getBarbershopByIdService(id);
   

     res.status(status.OK).json(barbershop);


 }catch(err: any){
   // Identificar o tipo de erro para retornar mensagens adequadas
   if(err.message ==='Barbearia não encontrada'){
  res.status(status.NOT_FOUND).json({message: err.message})
}else{
  console.error('Erro ao buscar Barbearia por ID:', err);
  res.status(status.INTERNAL_SERVER_ERROR).json({message: 'Erro ao buscar Barbearia especifica'})
}
  
 }

}


export const putBarbershop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; // Obtém o ID da barbearia da URL
    const barbershop = req.body; // Obtém os dados para atualização do corpo da requisição

    // Validações simples no controller (apenas para campos essenciais da rota)
    if (!id || isNaN(Number(id))) {
      return res.status(status.BAD_REQUEST).json({ message: "ID inválido fornecido." });
    }

    if (!barbershop || Object.keys(barbershop).length === 0) {
      return res.status(status.BAD_REQUEST).json({ message: "Nenhum dado fornecido para atualização." });
    }

    // Chama o serviço para processar a atualização
    const updatedBarbershop = await BarbershopService.updateBarbershopService(Number(id), barbershop);

    // Retorna a resposta com os dados atualizados
    return res.status(status.OK).json(updatedBarbershop);
  } catch (error: any) {
    console.error("Erro no controller ao atualizar barbearia:", error.message);

    // Erros genéricos do servidor
    if (error.message === "Nenhuma barbearia encontrada com o ID fornecido.") {
      return res.status(status.NOT_FOUND).json({ message: error.message });
    }

    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: "Erro ao atualizar barbearia." });
  }
};



export const deleteBarbershop = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extraindo o ID da barbearia dos parâmetros da rota
    const { id } = req.params;

    // Validando se o ID está presente e se é um número inteiro válido
    if (!id || isNaN(Number(id))) {
      return res.status(status.BAD_REQUEST).json({
        message: "ID inválido. O ID deve ser um número inteiro válido.",
      });
    }

    // Chamando o service para deletar a barbearia
    const result = await BarbershopService.deleteBarbershopService(Number(id));

    // Respondendo ao cliente com sucesso
    return res.status(status.OK).json({
      message: result,
    });
  } catch (error: any) {
    // Tratamento de erros do service
    console.error("Erro no controlador de exclusão:", error.message);

    // Respondendo com o código de status adequado
    const statusCode =
      error.message === "Nenhuma barbearia encontrada com o ID fornecido."
        ? status.NOT_FOUND
        : status.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      message: error.message || "Erro ao tentar excluir a barbearia.",
    });
  }
};
