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
  { title: 'My Items', component: "", function: "switchSegments" },
  { title: 'List Users', component: null, function: "openModal" },
  { title: 'Session ID', component: null, function: "openModal" },
  { title: 'Original Image', component: null, function: "openModal" },
  { title: 'Leave Session', component: "", function: "leaveSession" },
];
