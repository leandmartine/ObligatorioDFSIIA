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
  rolesPermitidos: [{
    type: mongoose.Schema.Types.Array,
    ref: "roles",
    required: true,
  }],
  activa: {
    type: Boolean,
    default: true,
  },
})

export default mongoose.model('Categoria', categoriaSchema);
