import { NavItem } from "../types/items";

const BUCKET_NAME = "assets";
const FOLDER_PATH = {
  image: "images",
  file: "files"
}

const ACCEPTED_TYPES = {
  image: "image/jpg, image/jpeg, image/png, image/webp",
  file: "application/pdf",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MAX_UPLOAD_FILE = {
  image: 10,
  file: 5
}

const MAX_TOTAL_FILE = {
  image: 30,
  file: 20,
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
const SIDEBAR_ITEMS: NavItem[] = [
  {
    title: 'Projects',
    url: '#',
    icon: 'github',
    isActive: true,
    items: [
      {
        title: 'Add Projects',
        url: '/dashboard/projects/new',
        icon: 'codePlus',
        shortcut: ['p', 'n']
      },
      {
        title: 'Manage Projects',
        shortcut: ['p', 'm'],
        url: '/dashboard/projects',
        icon: 'code'
      }
    ]
  },
  {
    title: 'Assets',
    url: '#',
    icon: 'folders',
    isActive: true,
    items: [
      {
        title: 'Upload Assets',
        shortcut: ['u', 'a'],
        url: '/dashboard/assets?action=upload',
        icon: 'folderPlus'
      },
      {
        title: 'Manage Assets',
        url: '/dashboard/assets',
        icon: 'folderCog',
        shortcut: ['m', 'a']
      },
      {
        title: 'Assets Library',
        url: '/dashboard/assets/library',
        icon: 'folders',
        shortcut: ['a', 'a']
      }
    ]
  },
  {
    title: 'Profile',
    url: '/dashboard/profile',
    icon: 'user2',
    shortcut: ['u', 'u'],
    isActive: false,
    items: [] // No child items
  },
];

export {
  BUCKET_NAME,
  FOLDER_PATH,
  ACCEPTED_TYPES,
  MAX_UPLOAD_FILE,
  MAX_FILE_SIZE,
  MAX_TOTAL_FILE,
  SIDEBAR_ITEMS
}