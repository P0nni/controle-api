"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../../../models/Manutencao e pecas/User"));
class AuthController {
    async register(req, res) {
        const { name, email, password, confirmPassword } = req.body;
        if (!name) {
            return res.status(422).json({ msg: "O nome é Obrigatorio!" });
        }
        if (!email) {
            return res.status(422).json({ msg: "O email é Obrigatorio!" });
        }
        if (!password) {
            return res.status(422).json({ msg: "a senha é Obrigatoria!" });
        }
        if (password != confirmPassword) {
            return res.status(422).json({ msg: "As senhas não são iguais!" });
        }
        //check exist
        const userExists = await User_1.default.findOne({ email: email, name: name });
        if (userExists) {
            return res.status(422).json({ msg: "Por favor, use outro email." });
        }
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        //create user
        const user = new User_1.default({
            name,
            email,
            password: passwordHash,
        });
        try {
            await user.save();
            res.status(201).json({ msg: "Usuario criado com sucesso!" });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                msg: "Aconteceu um erro no servidor, tente novamente mais tarde!",
            });
        }
        return res.json({});
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email) {
            return res.status(422).json({ msg: "O email é Obrigatorio!" });
        }
        if (!password) {
            return res.status(422).json({ msg: "a senha é Obrigatoria!" });
        }
        //check exist
        const user = await User_1.default.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "Usuario ou Senha invalido." });
        }
        //check password match
        const checkPassword = await bcrypt_1.default.compare(password, user.password);
        if (!checkPassword) {
            return res.status(404).json({ msg: "Usuario ou Senha invalido." });
        }
        try {
            const secret = process.env.SECRET;
            const token = {
                userId: user._id,
                name: user.name,
                authLevel: user.authLevel,
            };
            const tokenDecoded = jsonwebtoken_1.default.sign(token, secret, {
                expiresIn: 5400 /*1:30h*/,
            });
            res.status(200).json({
                msg: "Autenticação realizada com sucesso!",
                token: tokenDecoded,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "Aconteceu um erro no servidor, tente novamente mais tarde!",
            });
        }
    }
    async userById(req, res) {
        const id = req.params.id;
        try {
            const user = await User_1.default.findById(id, "-password");
            return res.status(200).json(user);
        }
        catch (error) {
            console.log(error);
            return res.status(404).json({ msg: "Usuario não encontrado." });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User_1.default.find().select("-password");
            return res.status(200).json(users);
        }
        catch (error) {
            console.log(error);
            return res.status(404).json({ msg: "Usuario não encontrado." });
        }
    }
    checkUserTokenLevel(req, res, next) {
        const id = req.params.id;
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Acesso negado" });
        }
        try {
            const secret = process.env.SECRET;
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (decoded.userId != id) {
                return res.status(401).json({ msg: "Acesso negado" });
            }
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                console.log("Token expirado");
                return res.status(400).json({ code: "T0", msg: "Token Expirado" });
            }
            else {
                return res.status(400).json({ code: "T9", msg: "Token Invalido" });
            }
        }
    }
    checkAdminTokenLevel(req, res, next) {
        const id = req.params.id;
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Acesso negado" });
        }
        try {
            const secret = process.env.SECRET;
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (decoded.authLevel != -1) {
                return res.status(401).json({ msg: "Acesso negado" });
            }
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                console.log("Token expirado");
                return res.status(400).json({ code: "T0", msg: "Token Expirado" });
            }
            else {
                return res.status(400).json({ code: "T9", msg: "Token Invalido" });
            }
        }
    }
    checkToken(req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Acesso negado" });
        }
        try {
            const secret = process.env.SECRET;
            jsonwebtoken_1.default.verify(token, secret);
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                console.log("Token expirado");
                return res.status(400).json({ code: "T0", msg: "Token Expirado" });
            }
            else {
                return res.status(400).json({ code: "T9", msg: "Token Invalido" });
            }
        }
    }
    async getUserByToken(req) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return null;
        }
        try {
            const secret = process.env.SECRET;
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (!decoded) {
                return null;
            }
            return decoded;
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                console.log("Token expirado");
                return null;
            }
            else {
                return null;
            }
        }
    }
}
exports.authController = new AuthController();
