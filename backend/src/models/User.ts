import mongoose from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  profile: {
    name: string;
    phone: string;
  };
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['patient', 'doctor', 'admin'] },
  profile: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);
