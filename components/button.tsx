import React from "react";

export default function Button({
  children,
  fontFamily,
  bg,
  width,
  height,
  fontSize,
  isLoading,
  ...rest
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: React.ReactNode;
  fontFamily?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  isLoading?: boolean;
  bg?: string;
}) {
  return (
    <button {...rest}>
      {children}
      <style jsx>{`
        button {
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-family: "JetBrains Mono", "Courier New", monospace;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
          margin-left: 8px;
        }
        button:hover:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 500px) {
          button {
            font-size: 14px;
          }
        }
      `}</style>
      <style jsx>{`
        button {
          background: ${bg || "rgba(255, 255, 255, 0.05)"};
          font-size: ${fontSize || "16"}px;
          width: ${width || "53"}px;
          height: ${height || "53"}px;
        }
      `}</style>
    </button>
  );
}
