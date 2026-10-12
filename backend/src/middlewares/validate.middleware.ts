import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Creates a middleware that validates the request body against a Zod schema.
 * Returns 400 with detailed field errors on validation failure.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as any).issues || (error as any).errors || [];
        const fieldErrors = issues.map((err: any) => ({
          field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
          message: err.message || 'Invalid input',
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          data: null,
          errors: fieldErrors,
        });
        return;
      }
      next(error);
    }
  };
};
