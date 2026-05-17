export function formatRunResult(result: unknown): string {
  if (!result) {
    return "No result available yet.";
  }

  if (typeof result === "string") {
    return result;
  }

  if (typeof result === "number" || typeof result === "boolean") {
    return String(result);
  }

  if (typeof result === "object") {
    const data = result as {
      finalResult?: unknown;
      error?: unknown;
      message?: unknown;
    };

    if (typeof data.finalResult === "string") {
      return data.finalResult;
    }

    if (typeof data.error === "string") {
      return `Error: ${data.error}`;
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    if (data.finalResult && typeof data.finalResult === "object") {
      return JSON.stringify(data.finalResult, null, 2);
    }

    return JSON.stringify(result, null, 2);
  }

  return String(result);
}