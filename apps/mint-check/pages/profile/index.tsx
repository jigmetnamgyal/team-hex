import './profile.module.scss';
import { WalletList } from '@team-hex/fe-auth-profile';

/* eslint-disable-next-line */
export interface ProfileProps {}

export function Index(props: ProfileProps) {
  return (
    <div>
      <WalletList/>
    </div>
  );
}

export default Index;
