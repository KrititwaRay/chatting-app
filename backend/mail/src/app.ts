import "dotenv/config";
import express from "express";
const app = express();


import { CommonHelper } from "../helper/common_helper";
import { httpCodes } from "../helper/httpCodes";
import { ILoggedInUser  } from "../helper/common.middleware";



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
    console.info(`App listening on port ${PORT}`)
});