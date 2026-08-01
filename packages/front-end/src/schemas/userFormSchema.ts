import { z } from 'zod';
import type { User } from '../types/user';

// Plain (non-optional) strings throughout: controlled inputs always produce a string ('' at
// minimum, never undefined), and "this field is optional" is a business rule enforced by
// `.min(1)` only where required - not a TS-level optionality concern.
export const userFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.').max(100, 'Must be 100 characters or fewer.'),
  middleName: z.string().trim().max(100, 'Must be 100 characters or fewer.'),
  lastName: z.string().trim().min(1, 'Last name is required.').max(100, 'Must be 100 characters or fewer.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(254, 'Must be 254 characters or fewer.')
    .email('Must be a valid email address.'),
  phoneNumber: z.string().trim().max(30, 'Must be 30 characters or fewer.'),
  address: z.string().trim().max(300, 'Must be 300 characters or fewer.'),
  adminNotes: z.string().trim().max(2000, 'Must be 2000 characters or fewer.'),
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
