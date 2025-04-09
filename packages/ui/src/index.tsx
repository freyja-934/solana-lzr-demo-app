import React from 'react';
import { Button } from './button';
import { Modal, ModalProps } from './modal';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export interface RowProps {
  label: string;
  value: string | number;
  className?: string;
}

export const Row: React.FC<RowProps> = ({ label, value, className = '' }) => {
  return (
    <div
      className={`flex flex-row items-center justify-between py-1 ${className}`}
    >
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export { Button, Modal, ModalProps };

