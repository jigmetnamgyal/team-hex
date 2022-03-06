import './hex-wrapper-link.module.scss';
import { Link as ChakraLink } from '@chakra-ui/react';
import React, { ForwardedRef } from 'react';
import { LinkProps } from '@chakra-ui/react';

export interface HexWrapperLinkProps extends LinkProps {
  label: string;
}

const HexWrapperLink = React.forwardRef((props: HexWrapperLinkProps, ref: ForwardedRef<HTMLAnchorElement>) => (
  <ChakraLink href={props.href} ref={ref} {...props}>
    {props.label}
  </ChakraLink>
))

export default HexWrapperLink;
