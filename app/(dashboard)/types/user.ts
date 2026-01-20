interface IAccountInfo { name: string; email: string; avatar_url: string }

type TTags = {
  id: string;
  text: string
}[]

interface ISocialLinks {
  [key: string]: string;
}

interface IProfile {
  avatar_url: IAccountInfo["avatar_url"];
  name: IAccountInfo["name"];
  email: IAccountInfo["email"];
  tagline: string;
  biography: string;
  roles: TTags;
  skills: TTags;
  social_links: ISocialLinks;
  cv_url: string;
}

export type { IAccountInfo, IProfile }