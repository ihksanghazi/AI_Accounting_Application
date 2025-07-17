// web_app/src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validasi input
    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    // 2. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse('Invalid credentials', { status: 401 }); // Unauthorized
    }

    // 3. Bandingkan password yang diberikan dengan hash di database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    // 4. Buat JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } // Token berlaku selama 1 hari
    );

    // Jangan kirim kembali password hash di response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error('LOGIN ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });

  }

}