import styles from './index.module.scss';
import { AiOutlineCodepen } from 'react-icons/ai';
import { Button } from '@chakra-ui/react';
import { Layout } from '@team-hex/ui-kit';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <Layout>
      <Button rightIcon={<AiOutlineCodepen/>} colorScheme='teal'>Test Button</Button>
    </Layout>
  );
}

export default Index;
