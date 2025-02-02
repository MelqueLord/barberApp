export function badRequestError(message: string) {
  return { type: "bad_request", message };
}

export function notFoundError(message: string) {
  return { type: "not_found", message };
}

export function databaseError(message: string) {
  return { type: "database_error", message };
}

export function unauthorizedError(message: string) {
  return { type: "unauthorized", message };
}