"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpController = void 0;
const MaquinaParada_1 = __importDefault(require("../../../models/Manutencao e pecas/MaquinaParada"));
const LoggerController_1 = require("./LoggerController");
const AuthController_1 = require("./AuthController");
const NotificationController_1 = require("./NotificationController");
class MpController {
    async all(req, res) {
        try {
            const mps = await MaquinaParada_1.default.find();
            return res
                .status(200)
                .json({ msg: "Maquinas Encontradas", maquinasParadas: mps });
        }
        catch (err) {
            return res.status(404).json({ msg: "Maquinas Paradas não encontradas" });
        }
    }
    async create(req, res) {
        try {
            const mpBody = req.body;
            const createdMp = await MaquinaParada_1.default.create(mpBody);
            return res
                .status(200)
                .json({ msg: "Maquina Parada Criada", maquinaParada: createdMp });
        }
        catch (err) {
            return res.status(404).json({ msg: "Maquinas Paradas não encontradas" });
        }
    }
    async delete(req, res) {
        return res.status(200).json({
            status: 200,
            response: "Api Online",
        });
    }
    async update(req, res) {
        const id = req.params.id;
        let new_mp = req.body;
        const mpToUpdate = await MaquinaParada_1.default.findById(id);
        const mp_updated = await MaquinaParada_1.default.findByIdAndUpdate(id, new_mp);
        if (!mp_updated || !mpToUpdate) {
            return res.status(200).json({
                msg: "Ocorreu  um erro ao atualizar a ficha.",
            });
        }
        const user = (await AuthController_1.authController.getUserByToken(req));
        await LoggerController_1.loggerController.addLogMp(LoggerController_1.ActionLog.update, mpToUpdate, mp_updated, user);
        await NotificationController_1.notificationController.new([mp_updated.info.supervisor, mp_updated.info.soliciting], `Ficha: ${mp_updated.info.form}`, `Nova Atualização por ${user.name}`, `mp/id?=${mp_updated.id}`);
        return res.status(200).json({ msg: "Ficha atualizada com sucesso" });
    }
    async byId(req, res) {
        const id = req.params.id;
        try {
            const mp = await MaquinaParada_1.default.findById(id);
            return res.status(200).json(mp);
        }
        catch {
            return res.status(404).json({ msg: "Ficha não encontrada." });
        }
    }
    async byModule(req, res) {
        const mod = req.params.module;
        try {
            const mps = await MaquinaParada_1.default.find({ "info.module": mod });
            return res.status(200).json(mps);
        }
        catch {
            return res.status(404).json({ msg: "Fichas não encontradas." });
        }
    }
    async byWarehouse(req, res) {
        const wh = req.params.warehouse;
        try {
            const mps = await MaquinaParada_1.default.find({ "info.warehouse": wh });
            return res.status(200).json(mps);
        }
        catch {
            return res.status(404).json({ msg: "Fichas não encontradas." });
        }
    }
    async allItems(req, res) {
        const filter = req.body;
        const mps = await getMps(filter);
        const items = mps.flatMap((mp) => {
            return mp.items.filter((item) => {
                if (filter.status == "Geral")
                    return true;
                return item.status == filter.status;
            });
        });
        return res.status(200).json(items);
    }
}
async function getMps(filter) {
    if (filter.initialDate && filter.finalDate) {
        return await MaquinaParada_1.default.find({
            status: filter.status,
            "info.createdAt": {
                $gte: ISODate(filter.initialDate),
                $lte: ISODate(filter.finalDate),
            },
        });
    }
    if (filter.initialDate && !filter.finalDate) {
        const dateNow = new Date(Date.now());
        return await MaquinaParada_1.default.find({
            status: filter.status,
            "info.createdAt": {
                $gte: ISODate(filter.initialDate),
                $lte: ISODate(dateNow),
            },
        });
    }
    return await MaquinaParada_1.default.find();
}
exports.mpController = new MpController();
function ISODate(date) {
    return date.toISOString();
}
