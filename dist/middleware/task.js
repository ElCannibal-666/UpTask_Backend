"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAuthorization = exports.taskBelongToPrpoject = exports.validateTaskExists = void 0;
const Task_1 = __importDefault(require("../models/Task"));
async function validateTaskExists(req, res, next) {
    try {
        const { taskId } = req.params;
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            // Si no se encuentra la tarea, devuelve un error 404
            return res.status(404).json({ error: "No se encontró la tarea" });
        }
        req.task = task;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "No se encontro la tarea", details: error.message });
    }
}
exports.validateTaskExists = validateTaskExists;
async function taskBelongToPrpoject(req, res, next) {
    try {
        if (req.task.project.toString() !== req.project.id.toString()) {
            const error = new Error("Accion no valida");
            return res.status(404).json({ error: error.message });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error durante la ejecución", details: error.message });
    }
}
exports.taskBelongToPrpoject = taskBelongToPrpoject;
async function hasAuthorization(req, res, next) {
    try {
        if (req.user.id.toString() !== req.project.manager.toString()) {
            const error = new Error("Accion no valida");
            return res.status(404).json({ error: error.message });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error durante la ejecución", details: error.message });
    }
}
exports.hasAuthorization = hasAuthorization;
//# sourceMappingURL=task.js.map