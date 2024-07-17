"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        // Instancia para poder crear un nuevo proyecto en la base de datos 
        const project = new Project_1.default(req.body);
        // Asigna un Manager
        project.manager = req.user.id;
        // Hacemos un try catch para poder manejar los errores al momento de la creacion de los proyectos
        try {
            await project.save();
            res.send("Proyecto Creado Correctamente");
        }
        catch (error) {
            console.log(error);
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            });
            res.json(projects);
        }
        catch (error) {
            console.log(error);
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id).populate("tasks");
            if (!project) {
                const error = new Error("No se encontro el proyecto");
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error("Acción no válida");
                return res.status(404).json({ error: error.message });
            }
            res.json(project);
        }
        catch (error) {
            console.log(error);
        }
    };
    static updateProject = async (req, res) => {
        const { projectId } = req.params;
        try {
            const project = await Project_1.default.findByIdAndUpdate(projectId, req.body);
            // Validacion para saber si un proyecto existe
            if (!project) {
                const error = new Error("No se encontro el proyecto");
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error("Solo el Manager puede actualizar un Proyecto");
                return res.status(404).json({ error: error.message });
            }
            project.clientName = req.body.clientName;
            project.projectName = req.body.projectName;
            project.description = req.body.description;
            await project.save();
            res.send("Proyecto Actualizado Correctamente");
        }
        catch (error) {
            console.log(error);
        }
    };
    static deleteProject = async (req, res) => {
        const { projectId } = req.params;
        try {
            const project = await Project_1.default.findById(projectId);
            // Validacion para saber que no haya un valor vacio
            await project?.deleteOne();
            // Validacion para saber si un proyecto existe
            if (!project) {
                const error = new Error("No se encontro el proyecto");
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error("Solo el Manager puede eliminar un Proyecto");
                return res.status(404).json({ error: error.message });
            }
            res.send("Proyecto Eliminado Correctamente");
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map