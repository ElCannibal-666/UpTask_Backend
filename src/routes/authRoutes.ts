import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleImputErrors } from "../middleware/validation";
import { autenticate } from "../middleware/auth";

const router = Router()

router.post("/create-account",
    body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
    body("password").isLength({ min: 8 }).withMessage("El password es muy corto, minimo 8 caracteres"),
    body("password_confirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Los password nos son iguales")
        }
        return true
    }),
    body("email").isEmail().withMessage("E-mail no valido"),
    handleImputErrors,
    AuthController.createAccount

)

router.post("/confirm-account",
    body("token").notEmpty().withMessage("El token no puede ir vacio"),
    handleImputErrors,
    AuthController.confirmAccount
)

router.post("/login",
    body("email").isEmail().withMessage("E-mail no valido"),
    body("password").notEmpty().withMessage("El password no puede ir vacio"),
    handleImputErrors,
    AuthController.login
)

router.post("/request-code",
    body("email").isEmail().withMessage("E-mail no valido"),
    handleImputErrors,
    AuthController.requestConfirmationCode
)

router.post("/forgot-password",
    body("email").isEmail().withMessage("E-mail no valido"),
    handleImputErrors,
    AuthController.forgotPassword
)

router.post("/validate-token",
    body("token").notEmpty().withMessage("El token no puede ir vacio"),
    handleImputErrors,
    AuthController.validateToken
)

router.post("/update-password/:token",
    param("token").isNumeric().withMessage("Token no valido"),
    body("password").isLength({ min: 8 }).withMessage("El password es muy corto, minimo 8 caracteres"),
    body("password_confirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Los password nos son iguales")
        }
        return true
    }),
    handleImputErrors,
    AuthController.updatePasswordWithToken
)

router.get("/user",
    autenticate,
    AuthController.user
)

/** Profile */
router.put("/profile",
    autenticate,
    body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
    body("email").isEmail().withMessage("E-mail no valido"),
    handleImputErrors,
    AuthController.updateProfile
)

router.post("/update-password",
    autenticate,
    body("current_password").notEmpty().withMessage("El password actual no puede ir vacio"),
    body("password").isLength({ min: 8 }).withMessage("El password es muy corto, minimo 8 caracteres"),
    body("password_confirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Los password nos son iguales")
        }
        return true
    }),
    handleImputErrors,
    AuthController.updateCurrentUserPassword
)

router.post("/check-password",
    autenticate,
    body("password").notEmpty().withMessage("El password no puede ir vacio"),
    handleImputErrors,
    AuthController.checkUserPassword
)

export default router