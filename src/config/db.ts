import mongoose from "mongoose"
import colors from "colors"
import { exit } from "node:process"

export const connectMongoDb = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB conectado en: ${url}`))
    } catch (error) {
        //console.log(error);
        console.log(colors.red.bold("Error al conectar a MongoDB"))
        exit(1)
    }
};

