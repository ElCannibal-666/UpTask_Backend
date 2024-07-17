"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        try {
            const { password, email } = req.body;
            // Prevenir usuarios duplicados
            const userExist = await User_1.default.findOne({ email });
            if (userExist) {
                const error = new Error("El usuario ya esta registrado");
                return res.status(409).json({ error: error.message });
            }
            // Crea un usuario
            const user = new User_1.default(req.body);
            // Hasheo de Password
            user.password = await (0, auth_1.hashPassword)(password);
            // Generacion del token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Envio de Email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await user.save();
            await token.save();
            // await Promise.allSettled([user.save(), token.save()])
            res.send("Cuenta creada, revisa tu email para confirmarla");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findOne(tokenExist.user);
            user.confirmed = true;
            await user.save();
            await tokenExist.deleteOne();
            res.send("Cuenta confirmada correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("Usuario no encontrado");
                return res.status(404).json({ error: error.message });
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                // Envio de Email
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });
                const error = new Error("La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmacion");
                return res.status(401).json({ error: error.message });
            }
            // Revisar el password del usuario
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error("La contraseña es incorrecta");
                return res.status(401).json({ error: error.message });
            }
            const token = (0, jwt_1.generateJWT)({ id: user._id });
            res.send(token);
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            // Si el usuario existe
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("El usuario no esta registrado");
                return res.status(404).json({ error: error.message });
            }
            if (user.confirmed) {
                const error = new Error("El usuario ya ha sido confirmado");
                return res.status(403).json({ error: error.message });
            }
            // Generacion del token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Envio de Email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await user.save();
            await token.save();
            // await Promise.allSettled([user.save(), token.save()])
            res.send("Se envió un nuevo token a tu email para confirmar la cuenta");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            // Si el usuario existe
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("El usuario no esta registrado");
                return res.status(404).json({ error: error.message });
            }
            // Generacion del token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            await token.save();
            // Envio de Email
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });
            // await Promise.allSettled([user.save(), token.save()])
            res.send("Revisa tu email para instrucciones");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            res.send("Token válido, define tu nueva contraseña");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExist.user);
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            await tokenExist.deleteOne();
            res.send("La contraseña se modifico correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static user = async (req, res) => {
        return res.json(req.user);
    };
    /** Profile */
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        const userExist = await User_1.default.findOne({ email });
        if (userExist && userExist.id.toString() !== req.user.id.toString()) {
            const error = new Error("Ese email ya esta registrado");
            return res.status(409).json({ error: error.message });
        }
        req.user.name = name;
        req.user.email = email;
        try {
            await req.user.save();
            res.send("Perfil actualizado correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("El password actual es incorrecto");
            return res.status(401).json({ error: error.message });
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send("El password se modificó correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static checkUserPassword = async (req, res) => {
        const { password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("El password es incorrecto");
            return res.status(401).json({ error: error.message });
        }
        res.send("Password Correcto");
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map