
export interface User {
  id:number;
  email:string;
  password:string;
  name:string;
  birthdate:string;
}

export type CreateUserDTO = Omit<User, 'id'>
export type UpdateUserDTO = Partial<Omit<User,'id'>>