import { Request, Response } from "express";
import Notification from "../../../models/Manutencao e pecas/Notification";
import User from "../../../models/Manutencao e pecas/User";

class NotificationController {
  public async new(
    users: string[],
    title: string,
    message: string,
    link: string
  ) {
    users.forEach(async (user) => {
      const userNot = await User.findOne({ name: user });
      if (userNot) {
        const notificationEntry = new Notification({
          userId: userNot._id,
          title,
          message,
          link,
          viewed: false,
        });
        await notificationEntry.save();
        console.log(notificationEntry);
      }
    });
  }

  public async byId(req: Request, res: Response) {
    const id = req.params.id;
    const notifications = await Notification.find({
      userId: id,
      viewed: false,
    });
    return res.status(201).json(notifications);
  }

  public async all(req: Request, res: Response) {
    const notifications = await Notification.find({
      viewed: false,
    });
    return res.status(201).json(notifications);
  }

  public async updateNotification(req: Request, res: Response) {
    const notificationId = req.params.id;
    const updated = await Notification.findByIdAndUpdate(notificationId, {
      viewed: true,
    });
    return res
      .status(201)
      .json({ msg: `${notificationId}: Atualizada`, updated: updated });
  }
}

export const notificationController = new NotificationController();
