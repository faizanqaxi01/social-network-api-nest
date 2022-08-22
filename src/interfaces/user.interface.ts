export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isModerator: boolean;
  type: string;
  followers: string[];
  following: string[];
}
