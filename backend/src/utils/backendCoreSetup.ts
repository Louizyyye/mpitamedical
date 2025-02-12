import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth';
import { appointmentRouter } from './routes/appointments';
import { recordsRouter } from './routes/records';
import { errorHandler } from './middleware/errorHandler';
import { authenticateJWT } from './middleware/auth';

// Exporting the app for use in other modules
export const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
// Removed duplicate PORT declaration
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', authenticateJWT, appointmentRouter);
app.use('/api/records', authenticateJWT, recordsRouter);
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['patient', 'doctor', 'admin'] },
  profile: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  }
});

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, required: true },
  status: { type: String, required: true, enum: ['pending', 'confirmed', 'cancelled'] },
  notes: String
});

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  prescription: String,
  notes: String,
  attachments: [String]
});

export const User = mongoose.model('User', UserSchema);
export const Appointment = mongoose.model('Appointment', AppointmentSchema);
export const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
