"use client";

import Link from "next/link";

type ButtonVariant = "primary" | "outline" | "accent" | "whatsapp";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-cream hover:bg-primary-light border border-primary",
  outline:
    "bg-transparent text-cream border border-cream hover:bg-cream/10",
  accent:
    "bg-accent text-white hover:bg-accent-dark border border-accent",
  whatsapp:
    "bg-whatsapp text-white hover:brightness-110 border border-whatsapp",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  external = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-8 py-3 font-medium transition-all duration-300 ease-out text-sm tracking-wide";

  const classes = `${baseStyles} ${variantStyles[variant]} ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  } ${className}`;

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
