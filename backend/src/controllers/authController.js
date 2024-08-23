import User from '../models/user.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const register = async (req, res) => {

  const { email, password,role } = req.body;


  const userExists = await User.findOne({ email });


  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }


  const user = await User.create({ 
    email, 
    password, 
    ...(role && { role }) 
  });



  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }

};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
      role: user.role
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (user) {
      res.json({
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
