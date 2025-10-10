import { ZodError } from "zod";

// Use correct types for Express error middleware
export default function errorHandler(err, _, res) {
  console.error("❌ Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }

  // Fallback for unknown types
  res.status(500).json({ message: "Unknown error" });
}
