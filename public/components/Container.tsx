import React from "react";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:py-8">{children}</div>
  );
};
