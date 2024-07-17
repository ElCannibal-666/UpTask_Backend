import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import { corsConfig } from "./config/cors"
import { connectMongoDb } from "./config/db"
import authRoutes from "./routes/authRoutes"
import projectRoutes from "./routes/projectRoutes"


// Llamama a la configuracion de las variables de entorno
dotenv.config()

// Llamada a la base de datos de Mongo
connectMongoDb();

const app = express();

// Llamamos a la conexion con el Uso de Cors dentro de la aplicacion
app.use(cors(corsConfig))

// Loggin
app.use(morgan("dev"))

// Habilitamos la posibilidad de leer archivos .json con la siguiente funcion
app.use(express.json())

// Routes del proyecto 
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)


export default app;