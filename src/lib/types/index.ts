export * from './database';

export type { ComponentProps } from 'react';

export type FormState = {
  isLoading: boolean;
  error?: string;
  success?: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type ClassNameProps = {
  className?: string;
};

export type ChildrenProps = {
  children: React.ReactNode;
};

export type NavItem = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: import('./database').User | null;
  isLoading: boolean;
};
