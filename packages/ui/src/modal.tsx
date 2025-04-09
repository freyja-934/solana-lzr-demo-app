'use client';
import React, { useEffect, useRef } from 'react';
import { cn } from './utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
}

export const Modal= ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
  closeOnClickOutside = true,
  showCloseButton = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (
      closeOnClickOutside &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={cn(
          'w-full rounded-lg bg-dark-surface shadow-xl',
          sizeClasses[size],
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
          {title && (
            <h3 className="text-lg font-medium dark:text-dark-text">{title}</h3>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-white-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              X
            </button>
          )}
        </div>
        <div className="p-4 dark:text-dark-text">{children}</div>
      </div>
    </div>
  );
};
