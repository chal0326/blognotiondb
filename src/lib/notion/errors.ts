export class NotionError extends Error {
  readonly name = 'NotionError';
  
  constructor(
    message: string,
    public readonly originalError?: unknown,
    public readonly code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, NotionError.prototype);
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotionError);
    }
  }

  static fromError(error: unknown, message: string): NotionError {
    if (error instanceof NotionError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new NotionError(
        `${message}: ${error.message}`,
        error,
        error.name
      );
    }
    
    return new NotionError(message, error);
  }

  static isNetworkError(error: unknown): boolean {
    const networkErrors = [
      'ECONNRESET',
      'ETIMEDOUT',
      'ECONNREFUSED',
      'EPIPE',
      'ENOTFOUND',
      'ENETUNREACH',
      'EHOSTUNREACH',
      'AbortError',
      'Failed to fetch'
    ];

    if (error instanceof Error) {
      return networkErrors.some(code => 
        error.message.includes(code) || 
        error.name === code
      );
    }
    return false;
  }
}