import { UserModel } from '../models/user.model';
import { User } from '@shared/types';

export const UserRepository = {
  findByFirebaseUid: async (firebaseUid: string): Promise<User | null> => {
    const doc = await UserModel.findOne({ firebaseUid });
    if (!doc) return null;
    return doc.toJSON() as User;
  },

  findByEmailAndLinkFirebaseUid: async (
    email: string,
    firebaseUid: string
  ): Promise<User | null> => {
    const doc = await UserModel.findOneAndUpdate(
      { email },
      { firebaseUid },
      { new: true }
    );
    if (!doc) return null;
    return doc.toJSON() as User;
  },

  findById: async (id: string): Promise<User | null> => {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return doc.toJSON() as User;
  },

  create: async (
    firebaseUid: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    displayName: string
  ): Promise<User> => {
    const doc = await UserModel.create({
      firebaseUid,
      email,
      firstName,
      lastName,
      username,
      displayName,
    });
    return doc.toJSON() as User;
  },
};
