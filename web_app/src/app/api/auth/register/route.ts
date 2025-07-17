// web_app/src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Inisialisasi Prisma Client (praktik terbaik: buat satu instance dan ekspor)
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 1. Validasi input dasar
    if (!email || !password || !name) {
      return new NextResponse('Missing email, password, or name', { status: 400 });
    }

    // 2. Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('User with this email already exists', { status: 409 }); // 409 Conflict
    }

    // 3. Hash kata sandi
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Buat user baru di database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Jangan kirim kembali password hash di response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('REGISTRATION ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });

  }

}