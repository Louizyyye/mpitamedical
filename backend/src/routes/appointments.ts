import { Router, Request, Response } from 'express';
import { Appointment } from '../models/Appointment';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { patient, doctor, datetime, status, notes } = req.body;

  const appointment = new Appointment({
    patient,
    doctor,
    datetime,
    status,
    notes
  });

  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find().populate('patient doctor');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(id, updates, { new: true });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export const appointmentRouter = router;
