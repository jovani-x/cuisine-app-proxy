import { body } from "express-validator";

const validateCredentials = [
  body("email").trim().escape().isEmail().normalizeEmail(),
  body("password").trim().escape().isLength({ min: 5 }),
];

export { validateCredentials };
