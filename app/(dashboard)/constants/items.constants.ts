import { NavItem } from "../types/items";

const PAGE_KEY = "page" as const;
const PER_PAGE_KEY = "perPage" as const;
const SORT_KEY = 'sort' as const;
const ARRAY_SEPARATOR = ',';
const DEBOUNCE_MS = 1000;
const THROTTLE_MS = 50;

const BUCKET_NAME = "assets";
const FOLDER_PATH = {
  image: "images",
  file: "files"
};

const ACCEPTED_TYPES = {
  image: "image/jpg, image/jpeg, image/png, image/webp",
  file: "application/pdf",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MAX_UPLOAD_FILE = {
  image: 10,
  file: 5
};

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
        shortcut: ['n', 'p']
      },
      {
        title: 'Manage Projects',
        shortcut: ['m', 'p'],
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
        shortcut: ['n', 'a'],
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
    title: 'Experiences',
    url: '#',
    icon: 'bookmark',
    isActive: true,
    items: [
      {
        title: 'Add Experiences',
        shortcut: ['n', 'e'],
        url: '/dashboard/experiences/new',
        icon: 'bookmarkPlus'
      },
      {
        title: 'Manage Experiences',
        shortcut: ['e', 'e'],
        url: '/dashboard/experiences',
        icon: 'bookmarks'
      },
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

const DURATION_OPTIONS = [
  { id: "lt-3", label: "< 3 Months" },
  { id: "3-6", label: "3-6 Months" },
  { id: "gt-6", label: "> 6 Months" },
  { id: "gt-36", label: "3+ Years" },
];

const WORK_TYPE_OPTIONS = [
  { id: "online", label: "Online / Remote" },
  { id: "offline", label: "Offline / On-site" },
];

const WORK_CATEGORY_OPTIONS = [
  { id: "full_time", label: "Full Time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
  { id: "freelance", label: "Freelance" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest", value: "start_date.desc", icon: "desc2" },
  { id: "oldest", label: "Oldest", value: "start_date.asc", icon: "asc2" },
  {
    id: "role",
    label: "Role",
    isSub: true,
    options: [
      { label: "Ascending", value: "role.asc", icon: "sortAZ" },
      { label: "Descending", value: "role.desc", icon: "sortZA" }
    ]
  },
  {
    id: "duration",
    label: "Duration",
    isSub: true,
    options: [
      { label: "Shortest to Longest", value: "duration.asc", icon: "sort09" },
      { label: "Longest to Shortest", value: "duration.desc", icon: "sort90" }
    ]
  },
];

const PAGE_SIZE_OPTIONS = [
  { id: "1", label: "5" },
  { id: "2", label: "10" },
  { id: "3", label: "15" },
];

export {
  PAGE_KEY,
  PER_PAGE_KEY,
  SORT_KEY,
  ARRAY_SEPARATOR,
  DEBOUNCE_MS,
  THROTTLE_MS,
  BUCKET_NAME,
  FOLDER_PATH,
  ACCEPTED_TYPES,
  MAX_UPLOAD_FILE,
  MAX_FILE_SIZE,
  MAX_TOTAL_FILE,
  SIDEBAR_ITEMS,
  DURATION_OPTIONS,
  WORK_TYPE_OPTIONS,
  WORK_CATEGORY_OPTIONS,
  SORT_OPTIONS,
  PAGE_SIZE_OPTIONS
};