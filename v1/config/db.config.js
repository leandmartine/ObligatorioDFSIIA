import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("La variable de entorno MONGO_URI no está definida");
    }

    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URI, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                family: 4,
            })
            .then((mongooseInstance) => {
                console.log("Conectado a la base de datos");
                return mongooseInstance;
            })
            .catch((error) => {
                cached.promise = null;
                cached.conn = null;
                console.error("Error al conectar a la base de datos", error);
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDB;