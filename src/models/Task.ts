import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
    PENDING: "pending",
    ON_HOLD: "onHold",
    IN_PROGRESS: "inProgress",
    UNDER_REVIEW: "underReview",
    COMPLETED: "completed",
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

// Declaracion de los tipos de datos que se van a utilizar en la base de datos desde TypeScrip con la forma de interface
export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
};

// Declaracion de los tipos de datos que se van a utilizar dentro de MongoDB utilizando mongoose
const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        require: true,
    },
    description: {
        type: String,
        trim: true,
        require: true,
    },
    // Relacionar Tasks with Projects
    project: {
        type: Types.ObjectId,
        ref: "Project",
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING,
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: "User",
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING,
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: "Note"
        }
    ]

}, { timestamps: true });

/** Middlewere */
TaskSchema.pre("deleteOne", { document: true }, async function () {
    const taskId = this._id
    if (!taskId) return
    await Note.deleteMany({ task: taskId })
})

// Declaracion del modelo de mongoose con el Schema que hemos creado en la parte de arriba
// tambien vamos a incluir las propiedades del Type para que tome los valores que hemos declarado
const Task = mongoose.model<ITask>("Task", TaskSchema)

export default Task;
