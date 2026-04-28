import express from "express";
const app = express();

import { user_routing } from "../domain/user/routes/user.routes"; 

app.use('/user', user_routing);

export const app_route = app;