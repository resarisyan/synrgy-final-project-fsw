import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ResponseError } from '../handlers/response-error';

export const errorMiddleware = (error: Error, req: Request, res: Response) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      success: false,
      message: error.message
    });
  } else {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
