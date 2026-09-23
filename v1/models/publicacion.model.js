import mongoose from "mongoose";

const publicacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  aceptaPermuta: {
    type: Boolean,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  // si es false, es en dolares, si es true, es en pesos uruguayos
  pesosUy:{
    type: Boolean,
    required: true,
  },
  alcance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles",
    required: true,
  }],
  cantidad: {
    type: Number,
    required: true,
  },
  nuevo: {
    type: Boolean,
    required: true,
  },
  estadoPublicacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EstadoPublicacion",
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  imagenUrl: {
    type: String,
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  activa: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Publicacion", publicacionSchema);