import './profile.module.scss';
import { WalletList } from '@team-hex/fe-auth-profile';
import { useAccount } from 'wagmi';
import { Button } from '@chakra-ui/react';

/* eslint-disable-next-line */
export interface ProfileProps {}

export function Index(props: ProfileProps) {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true
  });
  if (accountData) {
    return (
      // TODO: Replace with user profile
      <div>
        <p>{accountData.address}</p>
        <Button onClick={disconnect}>Disconnect</Button>
      </div>
    );
  }
  return (
    <div>
      <WalletList />
    </div>
  );
}

export default Index;
