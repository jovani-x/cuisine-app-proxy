import type { NextFunction, Response } from "express";
import { getTokenFromRequest } from "../lib/utils.js";
import { verifyToken } from "../services/user.js";
import type { UserRequest } from "../types/user.js";

const authenticate = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify token in cookie
    const token = getTokenFromRequest(req);
    const user = await verifyToken(token);

    // Invalid token
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Successfull token verification
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { authenticate };
