import jwt, { TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User, { IToken, IUser } from "../../models/User";

class AuthController {
  public async register(req: Request, res: Response) {
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
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ msg: "Por favor, use outro email." });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create user
    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    try {
      await user.save();
      res.status(201).json({ msg: "Usuario criado com sucesso!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg: "Aconteceu um erro no servidor, tente novamente mais tarde!",
      });
    }

    return res.json({});
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(422).json({ msg: "O email é Obrigatorio!" });
    }
    if (!password) {
      return res.status(422).json({ msg: "a senha é Obrigatoria!" });
    }

    //check exist
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "Usuario ou Senha invalido." });
    }

    //check password match
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({ msg: "Usuario ou Senha invalido." });
    }

    try {
      const secret = process.env.SECRET as string;
      const token: IToken = {
        userId: user._id,
        name: user.name,
        authLevel: user.authLevel,
      };
      const tokenDecoded = jwt.sign(token, secret, {
        expiresIn: 5400 /*1:30h*/,
      });

      res
        .status(200)
        .json({
          msg: "Autenticação realizada com sucesso!",
          token: tokenDecoded,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Aconteceu um erro no servidor, tente novamente mais tarde!",
      });
    }
  }

  public async userById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const user = await User.findById(id, "-password");
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ msg: "Usuario não encontrado." });
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select("-password");
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ msg: "Usuario não encontrado." });
    }
  }

  checkUserTokenLevel(req: Request, res: Response, next: any) {
    const id = req.params.id;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
      const secret = process.env.SECRET as string;
      const decoded = jwt.verify(token, secret) as IToken;
      if (decoded.userId != id) {
        return res.status(401).json({ msg: "Acesso negado" });
      }
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.log("Token expirado");
        return res.status(400).json({ code: "T0", msg: "Token Expirado" });
      } else {
        return res.status(400).json({ code: "T9", msg: "Token Invalido" });
      }
    }
  }

  checkAdminTokenLevel(req: Request, res: Response, next: any) {
    const id = req.params.id;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
      const secret = process.env.SECRET as string;
      const decoded = jwt.verify(token, secret) as IToken;
      if (decoded.authLevel != -1) {
        return res.status(401).json({ msg: "Acesso negado" });
      }
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.log("Token expirado");
        return res.status(400).json({ code: "T0", msg: "Token Expirado" });
      } else {
        return res.status(400).json({ code: "T9", msg: "Token Invalido" });
      }
    }
  }

  checkToken(req: Request, res: Response, next: any) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
      const secret = process.env.SECRET as string;
      jwt.verify(token, secret);

      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.log("Token expirado");
        return res.status(400).json({ code: "T0", msg: "Token Expirado" });
      } else {
        return res.status(400).json({ code: "T9", msg: "Token Invalido" });
      }
    }
  }

  public async getUserByToken(req: Request) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    try {
      const secret = process.env.SECRET as string;
      const decoded = jwt.verify(token, secret) as IToken;

      if (!decoded) {
        return null;
      }

      return decoded;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.log("Token expirado");
        return null;
      } else {
        return null;
      }
    }
  }
}

export const authController = new AuthController();
