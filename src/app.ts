import express from "express";
import { router } from "./router";
import mongoose from "mongoose";
require("dotenv").config();

export class App {
  public server: express.Application;
  MONGO_URI = process.env.MONGO_URI as string;

  constructor() {
    this.server = express();
    this.middleware();
    this.router();
    mongoose.connect(this.MONGO_URI).then(() => {
      console.log("Connected to DB");
    });
  }

  private middleware() {
    this.server.use(express.json());
  }

  private router() {
    this.server.use(router);
  }
}
