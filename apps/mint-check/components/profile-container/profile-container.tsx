import './profile-container.module.scss';
import { ProfileCard } from '@team-hex/ui-kit';
import { Button } from '@chakra-ui/react';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface ProfileContainerProps {
  address: string,
  nonce: string | undefined;
}

export function ProfileContainer({address, nonce}: ProfileContainerProps) {

  return (
    <div>
      <ProfileCard address={address}/>
    </div>
  );
}

export default ProfileContainer;
