import mongoose from "mongoose";

const rolesSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "roles" },
);

export default mongoose.model("RolesColeccion", rolesSchema);