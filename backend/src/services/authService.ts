import jwt from "jsonwebtoken";

import authConfig from "../config/auth";

export function signToken(payload: object) {
  return jwt.sign(payload, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
}
