export interface IUser {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  is_verified: boolean;
}
