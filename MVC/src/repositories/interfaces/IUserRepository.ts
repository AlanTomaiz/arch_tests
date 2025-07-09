import { UserModel } from "../../models/UserModel";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserModel | null>;
  create(user: UserModel): Promise<UserModel>;
}
