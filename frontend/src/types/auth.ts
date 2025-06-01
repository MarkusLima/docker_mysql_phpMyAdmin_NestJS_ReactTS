export type Role = 'admin' | 'user' | 'guest';

export interface User {
  username: string;
  role: Role;
}
