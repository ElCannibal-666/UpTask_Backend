"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImputErrors = void 0;
const express_validator_1 = require("express-validator");
// Tenemos que tener en orden los parametros de Request, Response y Next
// Para que no tengamos ningun error al momento de llamar la funcion
const handleImputErrors = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    // Si algun campo esta vacio te mandara un mensaje de error
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleImputErrors = handleImputErrors;
//# sourceMappingURL=validation.js.map