import type { User } from "../../domain/entities/User";

export interface IEmailPublisher {
  publishUserRegistered(user: User): Promise<void>;
}
