import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
  },
  rolesPermitidos: {
    type: [String],
    enum: ["estudiante", "profesor", "trabajador", "graduado"],
    default: [],
  },
  activa: {
    type: Boolean,
    default: true,
  },
})

export default mongoose.model('Categoria', categoriaSchema);
