import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { getTokenLifetime } from "../lib/utils.js";
import type { UserType } from "../types/user.js";

// Find user by email
const getUserByEmail = async (email: string): Promise<UserType | null> => {
  // Temporary implementation for demo
  const tempUserEmail = process.env.TEMP_USER_EMAIL;

  if (email !== tempUserEmail) return null;

  return {
    id: "test_12345",
    name: "Test Username",
    email: tempUserEmail,
    image: undefined,
  };
};

// User authentication
// if valid return user
// otherwise null
const authenticateUser = async ({
  password,
  email,
}: {
  password: string;
  email: string;
}): Promise<UserType | null> => {
  const user = await getUserByEmail(email);

  // User not found
  if (!user) return null;

  // Check password hash
  // Temporary implementation for demo
  const tempUserPass = process.env.TEMP_USER_PASS;
  if (tempUserPass !== password) return null;
  // const passHash = sha256.hmac(user.dsalt, password);
  // if (user.passHash !== passHash) return null;

  return user;
};

// Generate jwt token
const generateToken = async ({ user }: { user: UserType }) => {
  const AUTH_TOKEN_KEY = process.env.AUTH_TOKEN_KEY as Secret;
  const jwtOptions: SignOptions = {
    expiresIn: getTokenLifetime(),
  };

  return jwt.sign(user, AUTH_TOKEN_KEY, jwtOptions);
};

// Verify token
const verifyToken = async (token?: string): Promise<UserType | null> => {
  // No token
  if (!token) return null;

  const AUTH_TOKEN_KEY = process.env.AUTH_TOKEN_KEY as Secret;
  let user = null;

  jwt.verify(token, AUTH_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return null;
    } else {
      if (!decoded) return null;

      // Successfull verification
      const { id, name, email, image } = decoded as JwtPayload & UserType;
      user = { id, name, email, image };
      return user;
    }
  });

  return user;
};

export { authenticateUser, generateToken, getUserByEmail, verifyToken };
