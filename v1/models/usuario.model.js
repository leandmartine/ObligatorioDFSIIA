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
  perfil: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
  rolComunidad: {
    type: String,
    enum: ["estudiante", "profesor", "trabajador", "graduado"],
  },
  plan: {
    type: String,
    enum: ["plus", "premium"],
  },
  puedeModerar: {
    type: Boolean,
    default: false,
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true }); 

export default mongoose.model("Usuario", usuarioSchema);

