
import type { ComponentType } from 'react';

export interface NavLink {
  path: string;
  name: string;
  // Fix: Use ComponentType from 'react' instead of React.ComponentType
  icon: ComponentType<{ className?: string }>;
}
