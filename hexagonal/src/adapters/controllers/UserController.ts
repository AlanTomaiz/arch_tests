import type { Request, Response } from "express";
import { z } from "zod";
import type { UserService } from "../../domain/services/UserService";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export class UserController {
  constructor(private userService: UserService) {}

  registerUser = async (req: Request, res: Response) => {
    try {
      const data = userSchema.parse(req.body);
      const user = await this.userService.registerUser(data.email, data.name);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Erro no cadastro" });
    }
  };
}
