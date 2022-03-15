import './profile.module.scss';
import { WalletList } from '@team-hex/fe-auth-profile';
import { Connector, useAccount, useConnect } from 'wagmi';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { ProfileCard } from '@team-hex/ui-kit';
import ProfileContainer from '../../components/profile-container/profile-container';

/* eslint-disable-next-line */
export interface ProfileProps {
}

export function Index(props: ProfileProps) {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true
  });
  const [{ data, error }, connect] = useConnect();
  const [nonce, setNonce] = useState<string | undefined>(undefined);
  const onConnect = async (connector: Connector<any, any>) => {
    const { data: accountData } = await connect(connector);
    const wallet_address = accountData?.account;
    const { data } = await axios.post('http://localhost:4200/api/nonce', { wallet_address });
    setNonce(data?.value);
  };
  if (accountData) {
    return (
      // TODO: Replace with user profile
      <ProfileContainer address={accountData.address} nonce={nonce}/>
    );
  }
  return (
    <div>
      <WalletList onConnect={onConnect} connectors={data.connectors} />
    </div>
  );
}

export default Index;
