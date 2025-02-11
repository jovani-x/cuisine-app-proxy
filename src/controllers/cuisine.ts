import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const cuisineController = {
  proxyAPI: async (req: Request, res: Response, next: NextFunction) => {
    // Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Construct API URL
      const apiKey = process.env.RECIPE_API_KEY;
      const apiUrlBase = process.env.RECIPE_API_URL;
      const path = req.path;
      const apiUrl = `${apiUrlBase}${path}`;
      const headers = { "x-api-key": apiKey };
      const params = req.query;

      // Forward request to API
      const response = await axios.get(apiUrl, { headers, params });
      return res.status(200).json(response.data);
    } catch (error) {
      console.error("Proxy Error:", error);
      next(error);
    }
  },
};

export { cuisineController };
