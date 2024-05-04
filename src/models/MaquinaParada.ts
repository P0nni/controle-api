import mongoose, { Document, Schema } from "mongoose";
import Log, { ILog } from "./Log";
import { diff } from "deep-diff";
import zlib from "zlib";

const ItemMPSchema: Schema = new Schema({
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
      "Não Visualizado",
      "Visualizado",
      "Cancelado",
      "Em andamento",
    ],
    default: "Não Visualizado",
  },
});

const MPInfoSchema: Schema = new Schema({
  warehouse: { type: String, default: "" },
  module: { type: String, default: "" },
  form: { type: Number, default: 0 },
  machine: { type: Number, default: 0 },
  soliciting: { type: String, default: "" },
  supervisor: { type: String, default: "" },
});
const mpSchema = new Schema<IMP>({
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
});

export interface MPInfo {
  warehouse: string;
  module: string;
  form: number;
  machine: number;
  soliciting: string;
  supervisor: string;
}

export interface ItemMP {
  id: number;
  form: number;
  code: string;
  description: string;
  quantity: number;
  modifiedAt: string;
  status:
    | "Enviado com LR"
    | "Enviado"
    | "Aguardando Outro Modulo"
    | "Aguardando Transporte"
    | "Enviado para compra"
    | "Não Visualizado"
    | "Visualizado"
    | "Cancelado"
    | "Em andamento";
}

export interface IMP extends Document {
  info: MPInfo;
  items: ItemMP[];
  createdAt?: Date;
  updatedAt?: Date;
}

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

export default mongoose.model<IMP>("MaquinaParada", mpSchema);

// Função para comprimir um objeto de log
function compress(obj : any) {
  const logString = JSON.stringify(obj);
  return zlib.gzipSync(logString).toString('base64');
}