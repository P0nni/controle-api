"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerController = exports.ActionLog = void 0;
const Log_1 = __importDefault(require("../../../models/Manutencao e pecas/Log"));
const zlib_1 = __importDefault(require("zlib"));
const deep_diff_1 = require("deep-diff");
var ActionLog;
(function (ActionLog) {
    ActionLog[ActionLog["update"] = 0] = "update";
    ActionLog[ActionLog["delete"] = 1] = "delete";
    ActionLog[ActionLog["create"] = 2] = "create";
})(ActionLog || (exports.ActionLog = ActionLog = {}));
class LoggerController {
    async get(req, res) {
        const logs = (await Log_1.default.find());
        if (!logs) {
            return res.status(400).json({ msg: "log nao encontrado" });
        }
        logs.map((log) => {
            if (log.after)
                log.after = decompress(log.after);
            if (log.before)
                log.before = decompress(log.before);
            return log;
        });
        return res.status(200).json(logs);
    }
    async addLogMp(action, before, after, token) {
        const differences = compress((0, deep_diff_1.diff)(before, after));
        const compressedDocToUpdate = compress(before);
        const logEntry = new Log_1.default({
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
exports.loggerController = new LoggerController();
function decompress(compressed) {
    const buffer = Buffer.from(compressed, "base64");
    const decompressed = zlib_1.default.gunzipSync(buffer);
    return JSON.parse(decompressed.toString());
}
function compress(obj) {
    const logString = JSON.stringify(obj);
    return zlib_1.default.gzipSync(logString).toString("base64");
}
