import { Schema, model, Document, Types } from 'mongoose';
import { User } from '@fyltura/types';

interface IUserDocument extends Omit<User, 'id'>, Document {
  _id: Types.ObjectId;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpires?: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true, trim: true },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: IUserDocument) => {
        const user: User = {
          id: ret._id.toString(),
          email: ret.email,
          displayName: ret.displayName,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
        return user;
      },
    },
    toObject: { virtuals: true },
  }
);

export const UserModel = model<IUserDocument>('User', userSchema);
