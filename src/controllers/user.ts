import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  getAuthCookieName,
  getSameSite,
  getTokenFromRequest,
  getTokenLifetime,
  isProd,
} from "../lib/utils.js";
import {
  authenticateUser,
  generateToken,
  verifyToken,
} from "../services/user.js";

const userController = {
  login: async (req: Request, res: Response) => {
    // Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Wrong credentials" });
    }

    const { email, password } = req.body;

    try {
      const authUser = await authenticateUser({ email, password });

      // Wrong credentials
      if (!authUser) {
        return res.status(400).json({ message: "Wrong credentials" });
      }

      // Generate and return token
      const token = await generateToken({ user: authUser });
      const tokenDur = getTokenLifetime();
      const isProduction = isProd();
      const cookieName = getAuthCookieName();
      const sameSite = getSameSite();

      res.cookie(cookieName, token, {
        httpOnly: isProduction,
        secure: isProduction,
        sameSite: sameSite,
        maxAge: tokenDur,
        path: "/",
      });
      return res.status(200).json({ user: authUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      // Verify token in cookie
      const token = getTokenFromRequest(req);
      const user = await verifyToken(token);

      // Invalid token
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Remove cookie with token
      const cookieName = getAuthCookieName();
      const isProduction = isProd();
      const sameSite = getSameSite();
      return res
        .clearCookie(cookieName, {
          httpOnly: isProduction,
          secure: isProduction,
          sameSite: sameSite,
          path: "/",
        })
        .status(200)
        .json({ message: "Logout successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  me: async (req: Request, res: Response) => {
    try {
      // Verify token in cookie
      const token = getTokenFromRequest(req);
      const user = await verifyToken(token);

      // Invalid token
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Successfull token verification
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
};

export { userController };
