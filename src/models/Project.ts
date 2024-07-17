import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

// Declaracion de los tipos de datos que se van a utilizar en la base de datos desde TypeScrip
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
};

// Declaracion de los tipos de datos que se van a utilizar dentro de MongoDB utilizando mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        trim: true,
        require: true,
    },
    clientName: {
        type: String,
        trim: true,
        require: true,
    },
    description: {
        type: String,
        trim: true,
        require: true,
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: "Task"
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: "User"
    },
    team: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true });

/** Middlewere */
ProjectSchema.pre("deleteOne", { document: true }, async function () {
    const projectId = this._id
    if (!projectId) return
    const tasks = await Task.find({ project: projectId })
    for (const task of tasks) {
        await Note.deleteMany({ task: task.id })
    }
    await Task.deleteMany({ project: projectId })
})

// Declaracion del modelo de mongoose con el Schema que hemos creado en la parte de arriba
// tambien vamos a incluir las propiedades del Type para que tome los valores que hemos declarado
const Project = mongoose.model<IProject>("Project", ProjectSchema)

export default Project;
