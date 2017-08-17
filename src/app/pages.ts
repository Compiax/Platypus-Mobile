import { ProfileModal } from '../modals/profile/profile';
import { AboutModal } from '../modals/about/about';
export class Pages {
  title: string;
  component: Object;
}

export const PAGES = [
  { title: 'Profile', component: ProfileModal },
  { title: 'About', component: AboutModal },
];

export const SESSION_PAGES = [
  { title: "All Items", component: null },
  { title: 'My Items', component: null },
  { title: 'List Users', component: null },
  { title: 'Session ID', component: null },
  { title: 'Original Image', component: null },
  { title: 'Leave Session', component: null },
];
