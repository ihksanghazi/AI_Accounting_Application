// web_app/src/app/api/companies/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

// Helper function untuk otentikasi
async function getUserIdFromToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// HANDLER UNTUK MENGAMBIL DATA PERUSAHAAN (READ)
export async function GET(request: Request) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const company = await prisma.company.findUnique({
      where: { ownerId: userId },
    });

    // Tidak apa-apa jika hasilnya null, artinya user belum punya perusahaan
    return NextResponse.json(company);

  } catch (error) {
    console.error("Failed to fetch company:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// HANDLER UNTUK MEMBUAT PERUSAHAAN (CREATE) - sudah ada, sedikit disempurnakan
export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    // ... (sisa logika POST sama seperti sebelumnya, sudah benar)
    const body = await request.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Nama perusahaan wajib diisi" }, { status: 400 });
    const existingCompany = await prisma.company.findUnique({ where: { ownerId: userId } });
    if (existingCompany) return NextResponse.json({ error: "User sudah memiliki perusahaan" }, { status: 409 });
    
    const newCompany = await prisma.company.create({ data: { name, ownerId: userId } });
    
    // Ambil kembali data user yang terupdate untuk dikirim ke frontend
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });
    const { password: _, ...userWithoutPassword } = updatedUser!;

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });
    
  } catch (error) {
    console.error("Failed to create company:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// HANDLER UNTUK MENGUPDATE DATA PERUSAHAAN (UPDATE)
export async function PUT(request: Request) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    
    const body = await request.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Nama perusahaan wajib diisi" }, { status: 400 });

    const updatedCompany = await prisma.company.update({
      where: { ownerId: userId },
      data: { name },
    });

    return NextResponse.json(updatedCompany);

  } catch (error) {
    console.error("Failed to update company:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}