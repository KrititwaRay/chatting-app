import "dotenv/config";
import express from "express";
const app = express();


import { CommonHelper } from "../helper/common_helper";
import { httpCodes } from "../helper/httpCodes";
import { ILoggedInUser  } from "../helper/common_middleware";

import { createClient } from "redis";
import connectDb from "../configuration/db";
// import { connectRabbitMQ } from "../configuration/rabbitmq";
connectDb();
// connectRabbitMQ()


export const redisClient = createClient({
    url: process.env.REDIS_URL as string
})

redisClient.connect().then(() => {
    console.log(`✅ Connected to Redis!`)
}).catch((error: any) => {
    console.log(`Unable to connect Redis `, error)
})



let global_helper = new CommonHelper();


declare global {
     namespace Express {
        interface Request {
            user: ILoggedInUser;
        }
    }
    var Helpers: typeof global_helper;
    var HttpCodes: typeof httpCodes;
 
}
global.Helpers = global_helper;
global.HttpCodes = httpCodes;

app.use(express.json({ limit: '150mb' }));

import { app_route } from "./app_routing";

app.use('/v1', app_route);

const PORT = process.env.PORT; // 3000;

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.info(`App listening on port: ${PORT}`)
});