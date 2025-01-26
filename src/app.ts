import express, { json } from "express";
import routerBarbershop from "./routes/barbershop-routes";
import routerHaircut from "./routes/haircut-routes";
import  routerBarber  from "./routes/barber-routes"


//import cors from "cors";


function createApp(){
    const app = express()
//passando para meu servidor atraves do middleware converter o contetType  e corpo para json 
//define que as requisições serão json
    app.use(express.json())
    
    //usar o prefixo api para todos acessar o arquivo rotas
    //lembrando que todas as rotas levara o prefixo api com o da rota: api/players
      app.use("/api/barbershop" , routerBarbershop);
      app.use("/api/haircut", routerHaircut);
      app.use("/api/barber", routerBarber );
    
    
    //app.use(cors());
    return app;

}

export default createApp;
