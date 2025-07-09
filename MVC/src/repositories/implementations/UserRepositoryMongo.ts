import mongoose from "mongoose";
import { UserModel } from "../../models/UserModel";
import { IUserRepository } from "../interfaces/IUserRepository";

const userSchema = new mongoose.Schema<UserModel>({
  id: { type: String, required: true },
  name: String,
  email: { type: String, unique: true },
  createdAt: Date,
});

const User = mongoose.model<UserModel>("User", userSchema);

export class UserRepositoryMongo implements IUserRepository {
  async findByEmail(email: string): Promise<UserModel | null> {
    return User.findOne({ email }).lean();
  }

  async create(user: UserModel): Promise<UserModel> {
    return new User(user).save();
  }
}
