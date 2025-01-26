import {Sequelize} from 'sequelize'

// Conexão com o banco de dados
const sequelize = new Sequelize({
    dialect: 'mysql', 
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    logging: false, // Defina como 'true' se quiser ver as queries no console
  });
  
  export default sequelize;