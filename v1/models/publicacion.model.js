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
  tipoOferta: {
    type: String,
    enum: ["venta", "permuta", "gratis"],
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  moneda:{
    type: String,
    enum: ["USD", "UYU"],
    required: true,
  },
  alcance:{
    type: String,
    enum: ["estudiante", "profesor", "trabajador", "graduado"],
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  estadoItem: {
    type: String,
    enum: ["nuevo", "usado", "como_nuevo"],
    required: true,
  },
  estadoPublicacion: {
    type: String,
    enum: ["pendiente", "publicada", "rechazada", "vendida"],
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
}, { timestamps: true });

export default mongoose.model("Publicacion", publicacionSchema);