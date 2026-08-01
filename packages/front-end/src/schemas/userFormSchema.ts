import { z } from 'zod';
import type { User } from '../types/user';

// Plain (non-optional) strings throughout: controlled inputs always produce a string ('' at
// minimum, never undefined), and "this field is optional" is a business rule enforced by
// `.min(1)` only where required - not a TS-level optionality concern.
export const userFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  middleName: z.string().trim(),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().min(1, 'Email is required.').email('Must be a valid email address.'),
  phoneNumber: z.string().trim(),
  address: z.string().trim(),
  adminNotes: z.string().trim(),
  registered: z.string(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const emptyUserFormValues: UserFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  adminNotes: '',
  registered: '',
};

export function userToFormValues(user: User): UserFormValues {
  return {
    firstName: user.firstName,
    middleName: user.middleName ?? '',
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber ?? '',
    address: user.address ?? '',
    adminNotes: user.adminNotes,
    // `registered` is an ISO datetime string from the API; <input type="date"> needs YYYY-MM-DD.
    registered: user.registered ? user.registered.slice(0, 10) : '',
  };
}
