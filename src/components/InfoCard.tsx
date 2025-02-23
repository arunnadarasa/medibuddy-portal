
import { cn } from "@/lib/utils";
import React from "react";

interface InfoCardProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const InfoCard = ({ 
  title, 
  subtitle, 
  content, 
  className,
  style 
}: InfoCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-fadeIn",
        className
      )}
      style={style}
    >
      <div className="space-y-1 mb-4">
        {subtitle && (
          <span className="text-xs font-medium px-2 py-1 bg-mint-50 text-mint-700 rounded-full">
            {subtitle}
          </span>
        )}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="text-gray-600">{content}</div>
    </div>
  );
};
