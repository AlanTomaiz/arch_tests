import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { userSchema } from "../validators/UserValidator";

export class UserController {
  constructor(private service: UserService) {}

  register = async (req: Request, res: Response) => {
    try {
      const { name, email } = userSchema.parse(req.body);
      const user = await this.service.register(name, email);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
