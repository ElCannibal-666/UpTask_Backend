import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { TaskController } from "../controllers/TaskController"
import { handleImputErrors } from "../middleware/validation"
import { projectExists } from "../middleware/project"
import { hasAuthorization, validateTaskExists } from "../middleware/task"
import { taskBelongToPrpoject } from "../middleware/task"
import { autenticate } from "../middleware/auth"
import { TeamMemberController } from "../controllers/TeamController"
import { NoteController } from "../controllers/NoteController"

const router = Router()

router.use(autenticate)

// Tambien metemos las validaciones dentro de la estructura de nuestro proyecto
router.post("/",
    body("projectName")
        .notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion del proyecto es obligatoria"),
    handleImputErrors, // Este middleware debería estar antes del controlador para manejar los errores de validación.
    ProjectController.createProject
);

// Ruta para poder obtener todos los proyectos dentro de la base de datos
router.get("/", ProjectController.getAllProjects)

// Ruta para obtener un proyecto especifico dentro de la base de datos
router.get("/:id",
    param("id").isMongoId().withMessage("ID no valido"),
    handleImputErrors,
    ProjectController.getProjectById)

/** Routes para tareas */
router.param('projectId', projectExists)

// Ruta para poder actualizar un proyecto dentro de la base de datos
router.put("/:projectId",
    param('projectId').isMongoId().withMessage('ID no válido'),
    body("projectName")
        .notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion del proyecto es obligatoria"),
    handleImputErrors, // Este middleware debería estar antes del controlador para manejar los errores de validac
    hasAuthorization,
    ProjectController.updateProject)

// Ruta para poder eliminar un proyecto dentro de la base de datos 
router.delete("/:projectId",
    param("projectId").isMongoId().withMessage("El Numero de Id no es Valido"),
    handleImputErrors,
    hasAuthorization,
    ProjectController.deleteProject)

// Ruta para las tareas en la base de datos 
router.post("/:projectId/tasks",
    body("name")
        .notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion es obligatoria"),
    handleImputErrors, // Este middleware debería estar antes del controlador para manejar los errores de validación.
    TaskController.createTask)

// Ruta para obtener los proyectos junto con las tareas que tienen asignadas dentro de la base de datos 
router.get("/:projectId/tasks", TaskController.getProyectTask)

// Middleware para saber si una tarea existe 
router.param("taskId", validateTaskExists)

// Middleware para saber si una tarea pertenece a un proyecto
router.param("taskId", taskBelongToPrpoject)

// Ruta para obtener una tarea por su ID dentro de la base de datos
router.get("/:projectId/tasks/:taskId",
    param("taskId").isMongoId().withMessage("El Numero de Id no es Valido"),
    handleImputErrors,
    TaskController.getTaskById)

// Ruta para poder actualizar una tarea dentro de la base de datos
router.put("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId").isMongoId().withMessage("El Numero de Id no es Valido"),
    body("name")
        .notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion es obligatoria"),
    handleImputErrors,
    TaskController.updateTask)

// Ruta para poder eliminar una tarea dentro de la base de datos 
router.delete("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId").isMongoId().withMessage("El Numero de Id no es Valido"),
    handleImputErrors,
    TaskController.deleteTask)

// Ruta para poder cambiar el estdo de una tarea dentro de la base de datos 
router.post("/:projectId/tasks/:taskId/status",
    param("taskId").isMongoId().withMessage("El Numero de Id no es Válido"),
    body("status").notEmpty().withMessage("El estado es obligatorio"),
    handleImputErrors,
    TaskController.updateTaskStatus)


//** Routes for teams */
router.post("/:projectId/team/find",
    body("email").isEmail().toLowerCase().withMessage("Correo no válido"),
    handleImputErrors,
    TeamMemberController.findMemberByEmail
)

router.get("/:projectId/team",
    handleImputErrors,
    TeamMemberController.getProjectTeam
)

router.post("/:projectId/team",
    body("id").isMongoId().withMessage("ID no válido"),
    handleImputErrors,
    TeamMemberController.addMemberById
)

router.delete("/:projectId/team/:userId",
    param("userId").isMongoId().withMessage("ID no válido"),
    handleImputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Notes  */
router.post("/:projectId/tasks/:taskId/notes",
    body("content").notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleImputErrors,
    NoteController.createNote
)

router.get("/:projectId/tasks/:taskId/notes",
    NoteController.getTaskNotes
)

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
    param("noteId").isMongoId().withMessage("ID no válido"),
    handleImputErrors,
    NoteController.deleteNote
)
export default router;