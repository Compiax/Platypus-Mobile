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
