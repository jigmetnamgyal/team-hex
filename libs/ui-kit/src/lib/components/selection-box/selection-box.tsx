import './selection-box.module.scss';
import { Button, Center, Text } from '@chakra-ui/react';

/* eslint-disable-next-line */
export interface SelectionBoxProps {
  label: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

export function SelectionBox({label, leftIcon = undefined, rightIcon = undefined}: SelectionBoxProps) {
  return (
    <Center p={8}>
      <Button
        w={'full'}
        maxW={'md'}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        variant={'outline'}
      >
        <Center>
          <Text>{label}</Text>
        </Center>
      </Button>
    </Center>
  );
}

export default SelectionBox;
