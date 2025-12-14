export interface UserInput {
  name?: string;
  email: string;
  password: string;
  isPremium?: boolean;
  role?: "user" | "admin";
  chatMessageCount?: number;
}