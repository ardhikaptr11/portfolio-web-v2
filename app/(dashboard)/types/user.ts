interface IAccountInfo { name: string; email: string }

interface ITags {
  id: string;
  text: string
}[]

interface ISocialLinks {
  [key: string]: string;
}

interface IProfile {
  avatar_url: string;
  name: IAccountInfo["name"];
  email: IAccountInfo["email"];
  tagline: string;
  biography: string;
  roles: ITags;
  skills: ITags;
  social_links: ISocialLinks;
  cv_url: string;
}

export type { IAccountInfo, IProfile }