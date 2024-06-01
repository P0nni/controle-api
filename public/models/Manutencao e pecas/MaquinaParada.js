"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const zlib_1 = __importDefault(require("zlib"));
const counterSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
const Counter = mongoose_1.default.model("Counter", counterSchema);
const ItemMPSchema = new mongoose_1.Schema({
    id: { type: Number, default: 0 },
    form: { type: Number, default: 0 },
    code: { type: String, default: "" },
    description: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    modifiedAt: { type: String, default: "" },
    status: {
        type: String,
        enum: [
            "Enviado com LR",
            "Enviado",
            "Aguardando Outro Modulo",
            "Aguardando Transporte",
            "Enviado para compra",
            "Feito Desvio",
            "Cancelado",
            "Em andamento",
        ],
        default: "Não Visualizado",
    },
});
ItemMPSchema.pre("save", async function (next) { });
const MPInfoSchema = new mongoose_1.Schema({
    warehouse: { type: String, default: "" },
    module: { type: String, default: "" },
    form: { type: Number, unique: true, immutable: true },
    machine: { type: Number, default: 0 },
    soliciting: { type: String, default: "" },
    supervisor: { type: String, default: "" },
});
MPInfoSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate({ _id: "form" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.form = counter.seq;
    }
    next();
});
const mpSchema = new mongoose_1.Schema({
    info: {
        type: MPInfoSchema,
        require: true,
    },
    items: {
        type: [ItemMPSchema],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ["Concluido", "Não concluido", "Visualizado", "Não Visualizado"],
        required: true,
        default: "Não Visualizado"
    },
});
//MIDDLE WARES
mpSchema.pre("findOneAndUpdate", async function (next) {
    const docToUpdate = await this.model.findOne(this.getFilter());
    if (!docToUpdate) {
        throw new Error("Documento não encontrado para atualização.");
    }
    console.log("[Middleware findOneAndUpdate] Dados Antigos:", docToUpdate);
    this.set({ updatedAt: new Date() });
    next();
});
mpSchema.pre("save", async function (next) {
    this.items = this.items.map((item) => {
        item.form = this.info.form;
        return item;
    });
    next();
});
exports.default = mongoose_1.default.model("MaquinaParada", mpSchema);
// Função para comprimir um objeto de log
function compress(obj) {
    const logString = JSON.stringify(obj);
    return zlib_1.default.gzipSync(logString).toString("base64");
}
