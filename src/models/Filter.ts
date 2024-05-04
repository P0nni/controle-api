export interface IFilter{
    initialDate : Date;
    finalDate: Date;
    status: "Geral" | "Enviado com LR" | "Enviado" | "Aguardando Outro Modulo" | "Aguardando Transporte" | "Enviado para compra" | "Não Visualizado" | "Visualizado" | "Cancelado" | "Em andamento";
}