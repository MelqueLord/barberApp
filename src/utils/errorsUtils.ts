export const badRequestError = (message: string) => {
  return { type: "bad_request", message };
};

export const notFoundError = (message: string) => {
  return { type: "not_found", message };
};

export const databaseError = (message: string) => {
  return { type: "database_error", message };
};

export const unauthorizedError = (message: string) => {
  return { type: "unauthorized", message };
};
