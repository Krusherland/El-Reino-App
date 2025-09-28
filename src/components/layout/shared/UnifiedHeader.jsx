import React from 'react';
import { UnifiedNav } from './UnifiedNav';

export const UnifiedHeader = ({ isPrivate }) => {
  return (
    <header className="kingdom-header">
      <UnifiedNav isPrivate={isPrivate} />
    </header>
  );
};