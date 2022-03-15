import './profile-container.module.scss';
import { getToastConfig, ProfileCard, ToastConfigs } from '@team-hex/ui-kit';
import { useToast } from '@chakra-ui/react';
import { useSignMessage } from 'wagmi';

/* eslint-disable-next-line */
export interface ProfileContainerProps {
  address: string,
  nonce: string | undefined;
}

export function ProfileContainer({ address, nonce }: ProfileContainerProps) {
  const [{ data, error }, signMessage] = useSignMessage();
  const toast = useToast();
  const onEditClick = async () => {
    await signMessage({ message: 'hellow  world'});
    toast(getToastConfig('Logged In Successfully', ToastConfigs.Success));
  };

  return (
    <div>
      <ProfileCard onEditClick={onEditClick} address={address} />
    </div>
  );
}

export default ProfileContainer;
