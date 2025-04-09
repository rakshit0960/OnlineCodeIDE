import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { formatZodError } from "@/lib/validations";

/**
 * Handles API errors and returns an appropriate NextResponse
 * @param error The error to handle
 * @param status The HTTP status code to return (defaults to 500)
 * @returns A NextResponse with the error message and status code
 */
export function handleApiError(error: unknown, status = 500) {
  console.error(error);
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedError = formatZodError(error);
    console.error(`Validation error: ${formattedError}`);

    return NextResponse.json(
      {
        error: "Validation failed",
        message: formattedError,
        details: error.format()
      },
      { status: 400 }
    );
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    console.error(`API error: ${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status }
    );
  }

  // Handle objects with a message property
  if (typeof error === "object" && error !== null && "message" in error) {
    const errorMessage = (error as { message: string }).message;
    console.error(`API error: ${errorMessage}`);

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }

  // Fallback for unknown error types
  console.error(`Unexpected API error: ${error}`);
  return NextResponse.json(
    { error: `An unexpected error occurred: ${error}` },
    { status }
  );
}