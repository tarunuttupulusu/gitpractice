import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'valenti_luxury_super_secret_jwt_key_2026_fashion',
    { expiresIn: '30d' }
  );
};
