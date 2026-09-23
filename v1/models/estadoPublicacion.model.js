import mongoose from "mongoose";

const estadoPublicacionSchema = new mongoose.Schema(
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
  },
  { timestamps: true, collection: "estadoPublicacion" },
);

export default mongoose.model("EstadoPublicacion", estadoPublicacionSchema);