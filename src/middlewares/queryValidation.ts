import { query } from "express-validator";

const sanitizeQueryParams = [query("*").trim().escape()];

export { sanitizeQueryParams };
