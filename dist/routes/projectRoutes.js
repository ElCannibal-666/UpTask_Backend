"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ProjectController_1 = require("../controllers/ProjectController");
const TaskController_1 = require("../controllers/TaskController");
const validation_1 = require("../middleware/validation");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const task_2 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.autenticate);
// Tambien metemos las validaciones dentro de la estructura de nuestro proyecto
router.post("/", (0, express_validator_1.body)("projectName")
    .notEmpty().withMessage("El nombre del proyecto es obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty().withMessage("El nombre del cliente es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty().withMessage("La descripcion del proyecto es obligatoria"), validation_1.handleImputErrors, // Este middleware debería estar antes del controlador para manejar los errores de validación.
ProjectController_1.ProjectController.createProject);
// Ruta para poder obtener todos los proyectos dentro de la base de datos
router.get("/", ProjectController_1.ProjectController.getAllProjects);
// Ruta para obtener un proyecto especifico dentro de la base de datos
router.get("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("ID no valido"), validation_1.handleImputErrors, ProjectController_1.ProjectController.getProjectById);
/** Routes para tareas */
router.param('projectId', project_1.projectExists);
// Ruta para poder actualizar un proyecto dentro de la base de datos
router.put("/:projectId", (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID no válido'), (0, express_validator_1.body)("projectName")
    .notEmpty().withMessage("El nombre del proyecto es obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty().withMessage("El nombre del cliente es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty().withMessage("La descripcion del proyecto es obligatoria"), validation_1.handleImputErrors, // Este middleware debería estar antes del controlador para manejar los errores de validac
task_1.hasAuthorization, ProjectController_1.ProjectController.updateProject);
// Ruta para poder eliminar un proyecto dentro de la base de datos 
router.delete("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("El Numero de Id no es Valido"), validation_1.handleImputErrors, task_1.hasAuthorization, ProjectController_1.ProjectController.deleteProject);
// Ruta para las tareas en la base de datos 
router.post("/:projectId/tasks", (0, express_validator_1.body)("name")
    .notEmpty().withMessage("El nombre de la tarea es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty().withMessage("La descripcion es obligatoria"), validation_1.handleImputErrors, // Este middleware debería estar antes del controlador para manejar los errores de validación.
TaskController_1.TaskController.createTask);
// Ruta para obtener los proyectos junto con las tareas que tienen asignadas dentro de la base de datos 
router.get("/:projectId/tasks", TaskController_1.TaskController.getProyectTask);
// Middleware para saber si una tarea existe 
router.param("taskId", task_1.validateTaskExists);
// Middleware para saber si una tarea pertenece a un proyecto
router.param("taskId", task_2.taskBelongToPrpoject);
// Ruta para obtener una tarea por su ID dentro de la base de datos
router.get("/:projectId/tasks/:taskId", (0, express_validator_1.param)("taskId").isMongoId().withMessage("El Numero de Id no es Valido"), validation_1.handleImputErrors, TaskController_1.TaskController.getTaskById);
// Ruta para poder actualizar una tarea dentro de la base de datos
router.put("/:projectId/tasks/:taskId", task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("El Numero de Id no es Valido"), (0, express_validator_1.body)("name")
    .notEmpty().withMessage("El nombre de la tarea es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty().withMessage("La descripcion es obligatoria"), validation_1.handleImputErrors, TaskController_1.TaskController.updateTask);
// Ruta para poder eliminar una tarea dentro de la base de datos 
router.delete("/:projectId/tasks/:taskId", task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("El Numero de Id no es Valido"), validation_1.handleImputErrors, TaskController_1.TaskController.deleteTask);
// Ruta para poder cambiar el estdo de una tarea dentro de la base de datos 
router.post("/:projectId/tasks/:taskId/status", (0, express_validator_1.param)("taskId").isMongoId().withMessage("El Numero de Id no es Válido"), (0, express_validator_1.body)("status").notEmpty().withMessage("El estado es obligatorio"), validation_1.handleImputErrors, TaskController_1.TaskController.updateTaskStatus);
//** Routes for teams */
router.post("/:projectId/team/find", (0, express_validator_1.body)("email").isEmail().toLowerCase().withMessage("Correo no válido"), validation_1.handleImputErrors, TeamController_1.TeamMemberController.findMemberByEmail);
router.get("/:projectId/team", validation_1.handleImputErrors, TeamController_1.TeamMemberController.getProjectTeam);
router.post("/:projectId/team", (0, express_validator_1.body)("id").isMongoId().withMessage("ID no válido"), validation_1.handleImputErrors, TeamController_1.TeamMemberController.addMemberById);
router.delete("/:projectId/team/:userId", (0, express_validator_1.param)("userId").isMongoId().withMessage("ID no válido"), validation_1.handleImputErrors, TeamController_1.TeamMemberController.removeMemberById);
/** Routes for Notes  */
router.post("/:projectId/tasks/:taskId/notes", (0, express_validator_1.body)("content").notEmpty().withMessage("El contenido de la nota es obligatorio"), validation_1.handleImputErrors, NoteController_1.NoteController.createNote);
router.get("/:projectId/tasks/:taskId/notes", NoteController_1.NoteController.getTaskNotes);
router.delete("/:projectId/tasks/:taskId/notes/:noteId", (0, express_validator_1.param)("noteId").isMongoId().withMessage("ID no válido"), validation_1.handleImputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map