import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',  // Keep this - it's perfect for dashboard
    route: '/dashboard/home',
  },
  {
    displayName: 'Process Video',
    iconName: 'timeline',  // Timeline icon for plans/roadmap
    route: '/dashboard/process-video',
  },
  {
    displayName: 'Live Video',
    iconName: 'timeline',  // Timeline icon for plans/roadmap
    route: '/dashboard/live-video',
  },
   {
    displayName: 'Process Images',
    iconName: 'timeline',  // Timeline icon for plans/roadmap
    route: '/dashboard/process-image',
  },
];