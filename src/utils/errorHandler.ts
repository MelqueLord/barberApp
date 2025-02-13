import status from "http-status";
import { Response } from "express";

export const handleUnexpectedError = (
  res: Response,
  err: any,
  message = "Erro interno do servidor."
) => {
  console.error(message, err);
  return res.status(status.INTERNAL_SERVER_ERROR).json({ message });
};
