// frontend/src/types/index.ts

export interface Company {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  address: string;
  phone: string;
  type: string;
  ownerId: number;
}

export interface User {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  email: string;
  Company: Company | null;
}