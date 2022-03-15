import './profile-container.module.scss';
import { getToastConfig, ProfileCard, ToastConfigs } from '@team-hex/ui-kit';
import { useToast } from '@chakra-ui/react';
import { useSignMessage } from 'wagmi';
import { getJWT as queryJWT} from '../../api/mint-check.api';
import axios from 'axios';

/* eslint-disable-next-line */
export interface ProfileContainerProps {
  address: string,
}

export function ProfileContainer({ address }: ProfileContainerProps) {
  const [{ data, error }, signMessage] = useSignMessage();
  const toast = useToast();

  const getJWT = async ({message, value}: {message: string, value: string}, signature: string, wallet_address: string) => {
    await queryJWT({message, value, signature, wallet_address});
  }

  const onEditClick = async () => {
    const { data } = await axios.post('http://localhost:4200/api/nonce', { wallet_address: address });
    const response = await signMessage({ message: data?.value });
    if (response.data) {
      await getJWT(data, response.data, address,)
      toast(getToastConfig('Logged In Successfully', ToastConfigs.Success));
    }
  };

  return (
    <div>
      <ProfileCard onEditClick={onEditClick} address={address} />
    </div>
  );
}

export default ProfileContainer;
