import Image from "next/image";
import Link from "next/link";
import React from "react";

const links = [
  { label: "Founders", href: "/founders" },
  { label: "Guide", href: "/guide" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

export const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <Link href="/">
        <Image src="/finta_logo.svg" height={50} width={50} alt="logo" />
      </Link>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            className="font-medium text-black transition duration-200 hover:text-neutral-600"
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}

        <button className="rounded-lg bg-[#2579f4] px-4 py-2 font-bold tracking-wide text-white shadow-lg text-shadow-md">
          Start free trial
        </button>
      </div>
    </div>
  );
};
