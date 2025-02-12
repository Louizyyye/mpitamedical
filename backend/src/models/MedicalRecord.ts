import mongoose from 'mongoose';

export interface IMedicalRecord {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: Date;
  diagnosis: string;
  prescription: string;
  notes: string;
  attachments: string[];
}

const MedicalRecordSchema = new mongoose.Schema<IMedicalRecord>({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  prescription: String,
  notes: String,
  attachments: [String]
});

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
