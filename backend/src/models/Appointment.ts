import mongoose from 'mongoose';

export interface IAppointment {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  datetime: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
}

const AppointmentSchema = new mongoose.Schema<IAppointment>({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, required: true },
  status: { type: String, required: true, enum: ['pending', 'confirmed', 'cancelled'] },
  notes: String
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
