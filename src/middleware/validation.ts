import type { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

// Tenemos que tener en orden los parametros de Request, Response y Next
// Para que no tengamos ningun error al momento de llamar la funcion
export const handleImputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req)
    // Si algun campo esta vacio te mandara un mensaje de error
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}