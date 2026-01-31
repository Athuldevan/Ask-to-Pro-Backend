import type  { Request } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload extends jwt.JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
