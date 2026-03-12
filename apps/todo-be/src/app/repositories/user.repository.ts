import { UserModel } from '../models/user.model';
import { User } from '@fyltura/types';

export const UserRepository = {
  findByEmail: async (
    email: string
  ): Promise<(User & { passwordHash: string }) | null> => {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      displayName: doc.displayName,
      passwordHash: doc.passwordHash,
      createdAt: new Date(doc.createdAt as string | Date).toISOString(),
      updatedAt: new Date(doc.updatedAt as string | Date).toISOString(),
    };
  },

  findById: async (id: string): Promise<User | null> => {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return doc.toJSON() as User;
  },

  create: async (
    email: string,
    passwordHash: string,
    displayName: string
  ): Promise<User> => {
    const doc = await UserModel.create({ email, passwordHash, displayName });
    return doc.toJSON() as User;
  },
};
