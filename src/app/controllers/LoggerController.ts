import { Request, Response } from "express";
import Log, { ILog } from "../../models/Log";
import zlib from "zlib";
import { IMP } from "../../models/MaquinaParada";
import { diff } from "deep-diff";
import { IToken, IUser } from "../../models/User";

export enum ActionLog {
  update,
  delete,
  create,
}

class LoggerController {
  public async get(req: Request, res: Response) {
    const logs = (await Log.find()) as ILog[];
    if (!logs) {
      return res.status(400).json({ msg: "log nao encontrado" });
    }

    logs.map((log) => {
      if (log.after) log.after = decompress(log.after);
      if (log.before) log.before = decompress(log.before);
      return log;
    });

    return res.status(200).json(logs);
  }

  public async addLogMp(
    action: ActionLog,
    before: IMP,
    after: IMP,
    token: IToken
  ) {
    const differences = compress(diff(before, after));
    const compressedDocToUpdate = compress(before);
    const logEntry = new Log({
      action: action.toString(),
      documentId: before._id,
      collectionName: "MaquinaParada",
      before: compressedDocToUpdate,
      after: differences,
      modifiedBy: { userId: token.userId, name: token.name },
    });
    await logEntry.save();
  }


}
export const loggerController = new LoggerController();

function decompress(compressed: any) {
  const buffer = Buffer.from(compressed, "base64");
  const decompressed = zlib.gunzipSync(buffer);
  return JSON.parse(decompressed.toString());
}

function compress(obj: any) {
  const logString = JSON.stringify(obj);
  return zlib.gzipSync(logString).toString("base64");
}