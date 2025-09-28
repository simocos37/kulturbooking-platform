import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export default function Button({ children, ...rest }: Props) {
  return (
    <button className="btn-primary transition hover:opacity-90" {...rest}>
      {children}
    </button>
  );
}
