import { Response } from 'express';
import { ZodError } from 'zod';
import { NotFoundError } from 'objection';
import { ResponseError } from '../../handlers/response-error.js';

interface ErrorResponseParams {
  error: Error;
  res: Response;
}

export const errorResponse = ({ error, res }: ErrorResponseParams) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors
    });
  } else if (error instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      message: 'Not found'
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
