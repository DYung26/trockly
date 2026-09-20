import React from 'react';
import { Agentation } from 'agentation';

export default function AgentationDev() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return <Agentation />;
}
