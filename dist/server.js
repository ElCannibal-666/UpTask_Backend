"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_2 = require("./config/cors");
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
// Llamama a la configuracion de las variables de entorno
dotenv_1.default.config();
// Llamada a la base de datos de Mongo
(0, db_1.connectMongoDb)();
const app = (0, express_1.default)();
// Llamamos a la conexion con el Uso de Cors dentro de la aplicacion
app.use((0, cors_1.default)(cors_2.corsConfig));
// Loggin
app.use((0, morgan_1.default)("dev"));
// Habilitamos la posibilidad de leer archivos .json con la siguiente funcion
app.use(express_1.default.json());
// Routes del proyecto 
app.use("/api/auth", authRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map