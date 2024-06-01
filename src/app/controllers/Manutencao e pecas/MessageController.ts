import { IMessage } from "../../../models/Manutencao e pecas/Message";
import { Request, Response } from "express";
import Message from "../../../models/Manutencao e pecas/Message";

class MessageController {
  public async create(req: Request, res: Response) {
    try {
      const msgBody = req.body;
      const createdMsg = await Message.create(msgBody);

      return res
        .status(200)
        .json({ msg: "Message Criada", message: createdMsg });
    } catch (err) {
      return res.status(404).json({ msg: "Nada encontrado" });
    }
  }

  public async getBy(req: Request, res: Response) {
    const formId = req.body.formId;
    if (formId) {
      const messages = await Message.find({ documentId: formId });
      if (!messages) return res.json({ msg: "Não existe mensagens" });

      return res.status(200).json(messages);
    }
    return res.status(404).json({ msg: "Faltaram Parametros" });
  }
}

export const messageController = new MessageController();
