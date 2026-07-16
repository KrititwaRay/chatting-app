import express from "express";
const app = express();

import { chat_routing } from "../domain/chat/routes/chat.routes"; 

app.use('/chat', chat_routing);

export const app_route = app;