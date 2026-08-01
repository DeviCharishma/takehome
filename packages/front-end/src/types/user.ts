export interface User {
  id: number;
  registered: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}
