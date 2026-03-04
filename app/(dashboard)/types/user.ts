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
    url: IAccountInfo["avatar_url"] | null;
  }
  name: IAccountInfo["name"];
  email: IAccountInfo["email"];
  phone_number: string;
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

export type { TTags, ISocialLinks, IAccountInfo, IProfile }