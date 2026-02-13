
import { z } from 'zod';
import { 
  insertUserSchema, 
  insertPetSchema, 
  insertFinancialProfileSchema,
  users,
  pets,
  financialProfiles,
  userProgress
} from './schema';

// === SHARED ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
export const api = {
  auth: {
    signup: {
      method: 'POST' as const,
      path: '/api/auth/signup' as const,
      input: insertUserSchema.extend({ petName: z.string().optional() }),
      responses: {
        201: z.custom<any>(), // Returns user + default data
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ email: z.string(), password: z.string() }),
      responses: {
        200: z.custom<any>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<any>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  dashboard: {
    get: {
      method: 'GET' as const,
      path: '/api/dashboard' as const,
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          pets: z.array(z.custom<typeof pets.$inferSelect>()),
          financialProfile: z.custom<typeof financialProfiles.$inferSelect>(),
          progress: z.custom<typeof userProgress.$inferSelect>(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  pets: {
    create: {
      method: 'POST' as const,
      path: '/api/pets' as const,
      input: insertPetSchema,
      responses: {
        201: z.custom<typeof pets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/pets/:id' as const,
      input: insertPetSchema.partial(),
      responses: {
        200: z.custom<typeof pets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  financials: {
    update: {
      method: 'PUT' as const,
      path: '/api/financials' as const, // Singleton per user for now
      input: insertFinancialProfileSchema.partial(),
      responses: {
        200: z.custom<typeof financialProfiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
