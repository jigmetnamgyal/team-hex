import { ToastConfigs } from '@team-hex/ui-kit';
import { UseToastOptions } from '@chakra-ui/react';

export const getToastConfig = ( title: string, status: ToastConfigs): UseToastOptions => {
  return ({
    title,
    status,
  })
}
