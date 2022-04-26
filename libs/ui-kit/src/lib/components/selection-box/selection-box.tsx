import './selection-box.module.scss';
import { Button, Center, Text } from '@chakra-ui/react';

/* eslint-disable-next-line */
export interface SelectionBoxProps {
  label: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onButtonClick: () => void;
}

export function SelectionBox({label, leftIcon = undefined, onButtonClick, rightIcon = undefined}: SelectionBoxProps) {
  return (
    <Center p={1}>
      <Button
        onClick={onButtonClick}
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
