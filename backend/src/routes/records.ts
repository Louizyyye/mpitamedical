import { Router } from 'express';
import { MedicalRecord } from '../models/MedicalRecord';

const router = Router();

router.post('/', async (req, res) => {
  const { patient, doctor, date, diagnosis, prescription, notes, attachments } = req.body;

  const medicalRecord = new MedicalRecord({
    patient,
    doctor,
    date,
    diagnosis,
    prescription,
    notes,
    attachments
  });

  try {
    await medicalRecord.save();
    res.status(201).json(medicalRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create medical record' });
  }
});

router.get('/', async (req, res) => {
  try {
    const records = await MedicalRecord.find().populate('patient doctor');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve medical records' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const medicalRecord = await MedicalRecord.findByIdAndUpdate(id, updates, { new: true });
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(200).json(medicalRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update medical record' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const medicalRecord = await MedicalRecord.findByIdAndDelete(id);
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
});

// Define medical record routes here
// Example: router.get('/', async (req, res) => { ... });

export const recordsRouter = router;
