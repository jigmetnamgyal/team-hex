import './profile-container.module.scss';
import { getToastConfig, ProfileCard, ToastConfigs } from '@team-hex/ui-kit';
import { useToast } from '@chakra-ui/react';
import { useSignMessage } from 'wagmi';
import axios from 'axios';

/* eslint-disable-next-line */
export interface ProfileContainerProps {
  address: string,
}

export function ProfileContainer({ address }: ProfileContainerProps) {
  const [{ data, error }, signMessage] = useSignMessage();
  const toast = useToast();
  const onEditClick = async () => {
    const { data } = await axios.post('http://localhost:4200/api/nonce', { wallet_address: address });
    const response = await signMessage({ message: data?.value});
    if (response.data) toast(getToastConfig('Logged In Successfully', ToastConfigs.Success));
  };

  return (
    <div>
      <ProfileCard onEditClick={onEditClick} address={address} />
    </div>
  );
}

export default ProfileContainer;
