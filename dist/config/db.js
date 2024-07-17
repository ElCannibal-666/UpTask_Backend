"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const node_process_1 = require("node:process");
const connectMongoDb = async () => {
    try {
        const { connection } = await mongoose_1.default.connect(process.env.MONGO_URI);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors_1.default.magenta.bold(`MongoDB conectado en: ${url}`));
    }
    catch (error) {
        //console.log(error);
        console.log(colors_1.default.red.bold("Error al conectar a MongoDB"));
        (0, node_process_1.exit)(1);
    }
};
exports.connectMongoDb = connectMongoDb;
//# sourceMappingURL=db.js.map