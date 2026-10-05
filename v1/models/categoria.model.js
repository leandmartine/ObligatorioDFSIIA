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
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    }],
  },
  activa: {
    type: Boolean,
    default: true,
  },
})

export default mongoose.model('Categoria', categoriaSchema);
