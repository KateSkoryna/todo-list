import { UserModel } from '../models/user.model';
import { User } from '@fyltura/types';

type UserWithResetToken = User & {
  passwordHash: string;
  resetToken?: string;
  resetTokenExpires?: Date;
};

export const UserRepository = {
  findByEmail: async (email: string): Promise<UserWithResetToken | null> => {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      displayName: doc.displayName,
      passwordHash: doc.passwordHash,
      resetToken: doc.resetToken,
      resetTokenExpires: doc.resetTokenExpires,
      createdAt: new Date(doc.createdAt as string | Date).toISOString(),
      updatedAt: new Date(doc.updatedAt as string | Date).toISOString(),
    };
  },

  findByResetToken: async (
    token: string
  ): Promise<UserWithResetToken | null> => {
    const doc = await UserModel.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    }).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      displayName: doc.displayName,
      passwordHash: doc.passwordHash,
      resetToken: doc.resetToken,
      resetTokenExpires: doc.resetTokenExpires,
      createdAt: new Date(doc.createdAt as string | Date).toISOString(),
      updatedAt: new Date(doc.updatedAt as string | Date).toISOString(),
    };
  },

  setResetToken: async (
    id: string,
    token: string,
    expires: Date
  ): Promise<void> => {
    await UserModel.findByIdAndUpdate(id, {
      resetToken: token,
      resetTokenExpires: expires,
    });
  },

  updatePassword: async (id: string, passwordHash: string): Promise<void> => {
    await UserModel.findByIdAndUpdate(id, {
      passwordHash,
      $unset: { resetToken: '', resetTokenExpires: '' },
    });
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
