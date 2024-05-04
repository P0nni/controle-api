import { Request, Response } from "express";
import User from "../../models/User";

class UserController {

  public async create(req: Request, res: Response) {
    const userBody = req.body;
    const createdUser = await User.create(userBody);
    return res.status(200).json({
      status: 200,
      response: createdUser,
    });
  }

  public async all(req: Request, res: Response) {
    const users = await User.find();
    return res.status(201).json({
      status: 201,
      response: users,
    });
  }

}

export const userController = new UserController();
