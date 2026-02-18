interface IAccountInfo { name: string; email: string; avatar_url: string }

type TTags = {
  id: string;
  text: string
}[]

interface ISocialLinks {
  [key: string]: string;
}

interface IProfile {
  avatar: {
    id: string,
    url: IAccountInfo["avatar_url"];
  }
  name: IAccountInfo["name"];
  email: IAccountInfo["email"];
  motto: string;
  tagline: string;
  roles: TTags;
  skills: string[];
  social_links: ISocialLinks;
  cv: {
    id: string,
    url: string
  }
}

export type { ISocialLinks, IAccountInfo, IProfile }