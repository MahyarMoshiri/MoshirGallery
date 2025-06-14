
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'moshir-gallery-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): { adminId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string };
  } catch {
    return null;
  }
}

export async function createDefaultAdmin() {
  const existingAdmin = await prisma.admin.findFirst();
  if (!existingAdmin) {
    const hashedPassword = await hashPassword('admin123');
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
  }
}
