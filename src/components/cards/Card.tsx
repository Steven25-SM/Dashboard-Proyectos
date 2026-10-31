import React from "react";
export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  image?: string;
  footer?: React.ReactNode;
  hover?: boolean;
  className?: string;
}
export default function Card({
  children,
  title,
  subtitle,
  image,
  footer,
  hover = true,
  className = "",
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${hover ? "hover:shadow-xl hover:-translate-y-1" : ""} transition-all duration-300 ${className}`}
    >
      {image && (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title || "Imagen de tarjeta"}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
            )}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}
        <div className="text-gray-600">{children}</div>
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}
