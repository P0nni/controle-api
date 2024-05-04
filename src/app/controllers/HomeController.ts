import { Request, Response } from "express";

class HomeController {
  public home(req: Request, res: Response) {
    return res.status(200).json({
      status: 200,
      response: "Api Online",
    });
  }
}

export const homeController = new HomeController();
