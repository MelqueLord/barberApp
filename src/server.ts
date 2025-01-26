import createApp from "./app"
import sequelize from './config/db';


const app = createApp();


//tem que apontar oarquivo .env no config
const port = process.env.PORT || 3000;


const startServer = async () => {
    try {
      // Tenta autenticar a conexão com o banco de dados
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
  
      // Inicia o servidor
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
    } catch (err) {
      // Se ocorrer erro ao conectar, captura o erro e exibe
      console.error('Não foi possível conectar ao banco de dados:', err);
      process.exit(1);
    }
  };
  
  // Chama a função para iniciar o servidor
startServer();