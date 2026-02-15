import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  className?: string;
  children?: ReactNode;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  iconColor = "bg-blue-600",
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 sm:p-8 border border-blue-100 dark:border-blue-900",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-lg", iconColor)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {children && (
          <div className="flex items-center gap-2 shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
