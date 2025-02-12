import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for JWT generation

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Secret for JWT

interface RegisterRequestBody {
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  phone: string;
}

router.post('/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  const { email, password, role, name, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const user = new User({
    email,
    password: hashedPassword, // Save the hashed password
    role,
    profile: { name, phone }
  });

  try {
    await user.save();
    const token = jwt.sign({ id: user._id, role }, JWT_SECRET); // Generate JWT token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

interface LoginRequestBody {
  email: string;
  password: string;
}

router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) { // Compare hashed password
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate and return a JWT token here (not implemented in this example)
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET); // Generate JWT token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

export const authRouter = router;


