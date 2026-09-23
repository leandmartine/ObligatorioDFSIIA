import { required } from "joi";
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  esAdmin: {
    type: boolean,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles",
    required: true,
  },
  esPremium: {
    type: Boolean,
    required: true,

    default: false,
  },
  puedeModerar: {
    type: Boolean,
    default: false,
  },
  publicaciones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publicacion",
  }],
  activo: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true }); 

export default mongoose.model("Usuario", usuarioSchema);

