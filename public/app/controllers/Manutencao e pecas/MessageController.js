"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const Message_1 = __importDefault(require("../../../models/Manutencao e pecas/Message"));
class MessageController {
    async create(req, res) {
        try {
            const msgBody = req.body;
            const createdMsg = await Message_1.default.create(msgBody);
            return res
                .status(200)
                .json({ msg: "Message Criada", message: createdMsg });
        }
        catch (err) {
            return res.status(404).json({ msg: "Nada encontrado" });
        }
    }
    async getBy(req, res) {
        const formId = req.body.formId;
        if (formId) {
            const messages = await Message_1.default.find({ documentId: formId });
            if (!messages)
                return res.json({ msg: "Não existe mensagens" });
            return res.status(200).json(messages);
        }
        return res.status(404).json({ msg: "Faltaram Parametros" });
    }
}
exports.messageController = new MessageController();
