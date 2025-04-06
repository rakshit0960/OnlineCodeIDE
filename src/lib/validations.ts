import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

/**
 * Result type for validation function
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

/**
 * Validates request data against a Zod schema and returns appropriate response
 *
 * This utility function simplifies API route validation by handling common validation
 * logic and error formatting. It returns a typed result that can be easily used in API routes.
 *
 * @param {ZodSchema<T>} schema - The Zod schema to validate against
 * @param {unknown} data - The data to validate (typically from request.json())
 * @returns {Promise<ValidationResult<T>>} A promise that resolves to either a success object
 *   with the validated data or a failure object with a ready-to-return NextResponse
 *
 * @example
 * // In an API route:
 * const validation = await validateRequest(mySchema, await request.json());
 * if (!validation.success) return validation.response;
 * // Now you can use the typed and validated data
 * const { field1, field2 } = validation.data;
 */
export async function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  try {
    // Attempt to validate the data against the schema
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    // Handle Zod validation errors with detailed response
    if (error instanceof ZodError) {
      // Create a human-readable error message
      const errorMessage = formatZodError(error);

      // Log the formatted error for debugging
      console.error(`Validation error: ${errorMessage}`);

      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Validation failed",
            message: errorMessage,  // Include the formatted message
            details: error.format()
          },
          { status: 400 }
        ),
      };
    }

    // Handle other unexpected errors
    console.error("Validation error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      ),
    };
  }
}

/**
 * Formats a Zod validation error into a human-readable message string
 *
 * Useful for logging or displaying validation errors in a more concise format
 * compared to the full error.format() output.
 *
 * @param {ZodError} error - The Zod error object to format
 * @returns {string} A comma-separated string of all error messages with their paths
 *
 * @example
 * // "name: Required, email: Invalid email address"
 */
export function formatZodError(error: ZodError): string {
  return error.errors
    .map((err) => {
      const path = err.path.join(".");
      return `${path ? `${path}: ` : ""}${err.message}`;
    })
    .join(", ");
}
