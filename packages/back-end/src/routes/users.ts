import { Router } from 'express';
import { Op, fn, col, where as sqlWhere, Order, WhereOptions } from 'sequelize';
import { z } from 'zod';
import IRoute from '../types/IRoute';
import { User } from '../services/db';

// Maps the API's snake_case sort keys to the model's actual (camelCase) attributes.
// Also doubles as an allowlist so arbitrary column names can't reach the query.
const SORTABLE_COLUMNS = {
  first_name: 'firstName',
  last_name: 'lastName',
  email: 'email',
  created_at: 'createdAt',
} as const;

const SEARCHABLE_COLUMNS = ['firstName', 'lastName', 'email'] as const;

const ListUsersQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(['first_name', 'last_name', 'email', 'created_at']).default('last_name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// Shared by POST (full body) and PUT (`.partial()` of this, below).
const UserBodySchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().min(1, 'Email is required.').email('Must be a valid email address.'),
  phoneNumber: z.string().trim().optional(),
  address: z.string().trim().optional(),
  adminNotes: z.string().trim().optional(),
  registered: z.coerce.date().optional(),
});

const UpdateUserBodySchema = UserBodySchema.partial()
  .refine(data => Object.keys(data).length > 0, 'Request body must include at least one field.');

const IdParamSchema = z.object({
  id: z.coerce.number().int().positive('User id must be a positive integer.'),
});

// A user-facing 409 for the schema's unique `email` constraint, shaped like a Zod field error
// so the front-end can render it the same way as a 400.
const DUPLICATE_EMAIL_ERROR = {
  fieldErrors: { email: ['A user with this email already exists.'] },
};

const UsersRouter: IRoute = {
  route: '/users',
  router() {
    const router = Router();

    router.route('/')
      // Fetch users, with optional search, sorting, and offset-based pagination.
      .get(async (req, res) => {
        // pro tip: if you're not seeing any users, make sure you seeded the database.
        //          make sure you read the readme! :)

        const parsed = ListUsersQuerySchema.safeParse(req.query);

        if (!parsed.success) {
          return res.status(400).json({
            success: false,
            error: parsed.error.flatten(),
          });
        }

        const { search, sortBy, sortOrder, offset, limit } = parsed.data;

        // Case-insensitive partial match across name/email columns. `col()` only ever
        // references our own allowlisted column names, and the search term is passed as a
        // bound Op.like value, so this can't be used for SQL injection.
        const whereClause: WhereOptions | undefined = search
          ? {
              [Op.or]: SEARCHABLE_COLUMNS.map(column => (
                sqlWhere(fn('lower', col(column)), {
                  [Op.like]: `%${search.toLowerCase()}%`,
                })
              )),
            }
          : undefined;

        // `id` is a secondary sort key so pagination stays stable when the primary sort
        // column has duplicate values.
        const order: Order = [
          [SORTABLE_COLUMNS[sortBy], sortOrder],
          ['id', 'asc'],
        ];

        return User.findAndCountAll({ where: whereClause, order, limit, offset })
          .then(({ rows, count }) => {
            return res.json({
              success: true,
              data: rows,
              total: count,
            });
          })
          .catch(err => {
            console.error('Failed to list users.', err);
            res.status(500).json({
              success: false,
            });
          });
      })
      // Create a new user.
      .post(async (req, res) => {
        const parsedBody = UserBodySchema.safeParse(req.body);

        if (!parsedBody.success) {
          return res.status(400).json({
            success: false,
            error: parsedBody.error.flatten(),
          });
        }

        return User.create(parsedBody.data)
          .then(user => {
            return res.status(201).json({
              success: true,
              data: user,
            });
          })
          .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
              return res.status(409).json({
                success: false,
                error: DUPLICATE_EMAIL_ERROR,
              });
            }

            console.error('Failed to create user.', err);
            res.status(500).json({
              success: false,
            });
          });
      })
    ;

    router.route('/:id')
      // Update an existing user. Accepts a partial body - only the fields provided are changed.
      .put(async (req, res) => {
        const parsedParams = IdParamSchema.safeParse(req.params);

        if (!parsedParams.success) {
          return res.status(400).json({
            success: false,
            error: parsedParams.error.flatten(),
          });
        }

        const parsedBody = UpdateUserBodySchema.safeParse(req.body);

        if (!parsedBody.success) {
          return res.status(400).json({
            success: false,
            error: parsedBody.error.flatten(),
          });
        }

        try {
          const user = await User.findByPk(parsedParams.data.id);

          if (!user) {
            return res.status(404).json({
              success: false,
              error: 'User not found.',
            });
          }

          const updated = await user.update(parsedBody.data);

          return res.json({
            success: true,
            data: updated,
          });
        } catch (err) {
          if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
              success: false,
              error: DUPLICATE_EMAIL_ERROR,
            });
          }

          console.error('Failed to update user %d.', parsedParams.data.id, err);
          return res.status(500).json({
            success: false,
          });
        }
      })
      // Delete a user.
      .delete(async (req, res) => {
        const parsedParams = IdParamSchema.safeParse(req.params);

        if (!parsedParams.success) {
          return res.status(400).json({
            success: false,
            error: parsedParams.error.flatten(),
          });
        }

        try {
          const user = await User.findByPk(parsedParams.data.id);

          if (!user) {
            return res.status(404).json({
              success: false,
              error: 'User not found.',
            });
          }

          await user.destroy();

          return res.json({
            success: true,
            data: { id: parsedParams.data.id },
          });
        } catch (err) {
          console.error('Failed to delete user %d.', parsedParams.data.id, err);
          return res.status(500).json({
            success: false,
          });
        }
      })
    ;

    return router;
  },
};

export default UsersRouter;
