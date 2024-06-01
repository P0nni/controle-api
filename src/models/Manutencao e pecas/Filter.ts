export interface IFilter {
  initialDate: Date;
  finalDate: Date;
  status:
    | "Geral"
    | "Enviado com LR"
    | "Enviado"
    | "Aguardando Outro Modulo"
    | "Aguardando Transporte"
    | "Enviado para compra"
    | "Feito Desvio"
    | "Cancelado"
    | "Em andamento";
}
