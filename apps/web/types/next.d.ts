// This file extends the Next.js types to properly handle async server components
import { ReactNode } from 'react';

declare module 'react' {
  interface AsyncComponent<P = {}> {
    (props: P): Promise<ReactNode>;
  }
}

declare module 'next' {
  interface AsyncServerComponent<P = {}> {
    (props: P): Promise<ReactNode>;
  }
}
