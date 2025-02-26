import type { Request, Response } from "express";

const othersController = {
  wrongPath: async (_req: Request, res: Response) => {
    return res.status(400).json({ error: "Wrong path" });
  },
};

export { othersController };
