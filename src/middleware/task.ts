import type { Request, Response, NextFunction } from "express"
import Task, { ITask } from "../models/Task"

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function validateTaskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId)
        if (!task) {
            // Si no se encuentra la tarea, devuelve un error 404
            return res.status(404).json({ error: "No se encontró la tarea" });
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ error: "No se encontro la tarea", details: error.message })
    }
}

export async function taskBelongToPrpoject(req: Request, res: Response, next: NextFunction) {
    try {

        if (req.task.project.toString() !== req.project.id.toString()) {
            const error = new Error("Accion no valida")
            return res.status(404).json({ error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: "Hubo un error durante la ejecución", details: error.message })
    }
}

export async function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    try {

        if (req.user.id.toString() !== req.project.manager.toString()) {
            const error = new Error("Accion no valida")
            return res.status(404).json({ error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: "Hubo un error durante la ejecución", details: error.message })
    }
}