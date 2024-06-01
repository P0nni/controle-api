import { Request, Response } from "express";
import MaquinaParada, {
  IMP,
  ItemMP,
} from "../../../models/Manutencao e pecas/MaquinaParada";
import { IFilter } from "../../../models/Manutencao e pecas/Filter";
import { ActionLog, loggerController } from "./LoggerController";
import { authController } from "./AuthController";
import { IToken } from "../../../models/Manutencao e pecas/User";
import { notificationController } from "./NotificationController";

class MpController {
  public async all(req: Request, res: Response) {
    try {
      const mps = await MaquinaParada.find();
      return res
        .status(200)
        .json({ msg: "Maquinas Encontradas", maquinasParadas: mps });
    } catch (err) {
      return res.status(404).json({ msg: "Maquinas Paradas não encontradas" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const mpBody = req.body;
      const createdMp = await MaquinaParada.create(mpBody);

      return res
        .status(200)
        .json({ msg: "Maquina Parada Criada", maquinaParada: createdMp });
    } catch (err) {
      return res.status(404).json({ msg: "Maquinas Paradas não encontradas" });
    }
  }

  public async delete(req: Request, res: Response) {
    return res.status(200).json({
      status: 200,
      response: "Api Online",
    });
  }

  public async update(req: Request, res: Response) {
    const id = req.params.id;
    let new_mp = req.body as IMP;
    const mpToUpdate = await MaquinaParada.findById(id);
    const mp_updated = await MaquinaParada.findByIdAndUpdate(id, new_mp);

    if (!mp_updated || !mpToUpdate) {
      return res.status(200).json({
        msg: "Ocorreu  um erro ao atualizar a ficha.",
      });
    }
    const user = (await authController.getUserByToken(req)) as IToken;
    await loggerController.addLogMp(
      ActionLog.update,
      mpToUpdate,
      mp_updated,
      user
    );

    await notificationController.new(
      [mp_updated.info.supervisor, mp_updated.info.soliciting],
      `Ficha: ${mp_updated.info.form}`,
      `Nova Atualização por ${user.name}`,
      `mp/id?=${mp_updated.id}`
    );
    return res.status(200).json({ msg: "Ficha atualizada com sucesso" });
  }

  public async byId(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const mp = await MaquinaParada.findById(id);
      return res.status(200).json(mp);
    } catch {
      return res.status(404).json({ msg: "Ficha não encontrada." });
    }
  }

  public async byModule(req: Request, res: Response) {
    const mod = req.params.module;
    try {
      const mps = await MaquinaParada.find({ "info.module": mod });
      return res.status(200).json(mps);
    } catch {
      return res.status(404).json({ msg: "Fichas não encontradas." });
    }
  }

  public async byWarehouse(req: Request, res: Response) {
    const wh = req.params.warehouse;
    try {
      const mps = await MaquinaParada.find({ "info.warehouse": wh });
      return res.status(200).json(mps);
    } catch {
      return res.status(404).json({ msg: "Fichas não encontradas." });
    }
  }

  public async allItems(req: Request, res: Response) {
    const filter = req.body as IFilter;
    const mps = await getMps(filter);

    const items = mps.flatMap((mp) => {
      return mp.items.filter((item) => {
        if (filter.status == "Geral") return true;
        return item.status == filter.status;
      });
    });
    return res.status(200).json(items);
  }
}

async function getMps(filter: IFilter) {
  if (filter.initialDate && filter.finalDate) {
    return await MaquinaParada.find({
      status: filter.status,
      "info.createdAt": {
        $gte: ISODate(filter.initialDate),
        $lte: ISODate(filter.finalDate),
      },
    });
  }

  if (filter.initialDate && !filter.finalDate) {
    const dateNow = new Date(Date.now());
    return await MaquinaParada.find({
      status: filter.status,
      "info.createdAt": {
        $gte: ISODate(filter.initialDate),
        $lte: ISODate(dateNow),
      },
    });
  }

  return await MaquinaParada.find();
}

export const mpController = new MpController();

function ISODate(date: Date): string {
  return date.toISOString();
}
