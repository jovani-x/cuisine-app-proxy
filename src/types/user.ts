import type { Request } from "express";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

interface UserRequest extends Request {
  user?: UserType;
}

export type { UserRequest, UserType };
