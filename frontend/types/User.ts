export interface BasicUserInfo {
  firstName: string;
  userId: string;
  // token is not accessible with JS
}
export interface FullUserInfo extends BasicUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  bio: string;
  adResponses: {id: string}[];
}
