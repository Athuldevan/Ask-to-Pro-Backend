export interface UserInput {
  name?: string;
  email: string;
  password: string;
  isPremium?: boolean;
  role?: "user" | "admin";
  chatMessageCount?: number;
}

export interface StudentType  {
  name : string;
  email : string;
  password?:string;
  image?:string;
  

}