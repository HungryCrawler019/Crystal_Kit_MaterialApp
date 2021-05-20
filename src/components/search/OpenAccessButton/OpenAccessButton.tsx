import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { OpenAccessLink } from '../OpenAccessLink';
import { OpenAccessLinkProps } from '../OpenAccessLink/OpenAccessLink';

export const OpenAccessButton: React.FC<OpenAccessLinkProps> = (props) => {
  props = {
    className: 'button is-small',
    children: 'PDF',
    target: '_blank',
    ...props,
  };

  return <OpenAccessLink {...props} />;
};