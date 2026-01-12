import { NavItem } from "../types/items";

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const SIDEBAR_ITEMS: NavItem[] = [
  {
    title: 'Profile',
    url: '/dashboard/profile',
    icon: 'user2',
    shortcut: ['u', 'u'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Projects',
    url: '/dashboard/projects',
    icon: 'github',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
];