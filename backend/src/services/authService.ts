import jwt from "jsonwebtoken";

import authConfig from "../config/auth";

export function signToken(userId: string) {
  return jwt.sign({}, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
    subject: userId,
  });
}
