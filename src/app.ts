import express from "express";
import { router } from "./router";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Jwt } from "jsonwebtoken";
require("dotenv").config();

export class App {
  public server: express.Application;
  dbUser = process.env.DB_USER;
  dbPass = process.env.DB_PASS;

  constructor() {
    this.server = express();
    this.middleware();
    this.router();
    mongoose
      .connect(
        `mongodb+srv://${this.dbUser}:${this.dbPass}@freecluster.lxcvyqc.mongodb.net/?retryWrites=true&w=majority&appName=FreeCluster`
      )
      .then(() => {
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
