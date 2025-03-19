
import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { Card as ShadcnCard } from "@/components/ui/card";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

// Enhanced button with animation and press effect - Mobile optimized
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ShadcnButton> & {
    isLoading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  }
>(({ className, children, isLoading, iconLeft, iconRight, ...props }, ref) => (
  <ShadcnButton
    ref={ref}
    className={cn(
      "relative overflow-hidden transition-all-300 active:scale-[0.98] shadow-button",
      "after:absolute after:inset-0 after:z-10 after:opacity-0 hover:after:opacity-10 after:bg-white",
      "after:transition-opacity after:duration-300",
      "text-sm whitespace-nowrap min-h-[40px]",
      className
    )}
    {...props}
    disabled={isLoading || props.disabled}
  >
    {isLoading && (
      <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
    )}
    {!isLoading && iconLeft && (
      <span className="mr-2 flex-shrink-0">{iconLeft}</span>
    )}
    <span className="transition-all-200 px-0.5 truncate">{children}</span>
    {!isLoading && iconRight && (
      <span className="ml-2 flex-shrink-0">{iconRight}</span>
    )}
  </ShadcnButton>
));
Button.displayName = "Button";

// Next button with arrow - Mobile optimized
export const NextButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, variant = "gradient-blue", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    iconRight={<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" />}
    className={cn(
      "group",
      props.className
    )}
    {...props}
  >
    {children || "Next"}
  </Button>
));
NextButton.displayName = "NextButton";

// Back button with arrow - Mobile optimized
export const BackButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, variant = "blue-outline", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    iconLeft={<ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200 flex-shrink-0" />}
    className={cn(
      "group",
      props.className
    )}
    {...props}
  >
    {children || "Back"}
  </Button>
));
BackButton.displayName = "BackButton";

// Glass Card component - Mobile optimized
export const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ShadcnCard> & {
    hoverEffect?: boolean;
    glowEffect?: boolean;
    compact?: boolean;
  }
>(({ className, children, hoverEffect = true, glowEffect = false, compact = false, ...props }, ref) => (
  <ShadcnCard
    ref={ref}
    className={cn(
      "glass-card border-white/20 bg-white/80 backdrop-blur-lg",
      hoverEffect && "hover:shadow-card hover:border-white/30 transition-all-300",
      glowEffect && "cricket-glow",
      compact && "p-3",
      className
    )}
    {...props}
  >
    {children}
  </ShadcnCard>
));
GlassCard.displayName = "GlassCard";

// Form Input with label - Mobile optimized
export const FormInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof ShadcnInput> & {
    label?: string;
    error?: string;
    iconLeft?: React.ReactNode;
  }
>(({ className, label, error, id, iconLeft, ...props }, ref) => (
  <div className="space-y-2">
    {label && (
      <Label htmlFor={id} className="text-sm font-medium flex items-center text-blue-900">
        {label}
      </Label>
    )}
    <div className="relative">
      {iconLeft && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 flex-shrink-0">
          {iconLeft}
        </div>
      )}
      <ShadcnInput
        ref={ref}
        id={id}
        className={cn(
          "transition-all-200 shadow-input focus:shadow-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          iconLeft && "pl-10",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    </div>
    {error && (
      <p className="text-xs text-red-500 animate-slide-up">{error}</p>
    )}
  </div>
));
FormInput.displayName = "FormInput";

// Page transition wrapper - Mobile optimized
export const PageTransition = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "animate-fade-in w-full max-w-md mx-auto transition-all duration-500",
      className
    )}
  >
    {children}
  </div>
);

// Section title component - Mobile optimized
export const SectionTitle = ({
  title,
  subtitle,
  className,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}) => (
  <div className={cn("space-y-1 text-center", compact ? "mb-3" : "mb-6", className)}>
    <h1 className={cn("font-semibold tracking-tight text-balance", compact ? "text-xl" : "text-2xl")}>{title}</h1>
    {subtitle && (
      <p className="text-muted-foreground text-sm text-balance max-w-sm mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

// Page container with background - Mobile optimized
export const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    "gradient-blue-red min-h-screen flex flex-col items-center justify-center p-4 sm:p-6",
    className
  )}>
    {children}
  </div>
);

// Card with hover effect - Mobile optimized
export const HoverCard = ({
  children,
  className,
  onClick,
  compact = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  compact?: boolean;
}) => (
  <div
    className={cn(
      "rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
      compact ? "p-3" : "p-4",
      "bg-white",
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

// Animated badge - Mobile optimized
export const AnimatedBadge = ({
  children,
  className,
  variant = "blue",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "blue" | "red";
}) => (
  <div className={cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium animate-bounce-subtle",
    variant === "blue" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-red-100 text-red-800",
    className
  )}>
    {children}
  </div>
);

// Icon with background - Mobile optimized
export const IconBackground = ({
  icon,
  className,
  size = "default",
  variant = "blue",
}: {
  icon: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "blue" | "red";
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12"
  };
  
  return (
    <div className={cn(
      "rounded-full flex items-center justify-center flex-shrink-0",
      variant === "blue" 
        ? "bg-blue-100 text-blue-600" 
        : "bg-red-100 text-red-500",
      sizeClasses[size],
      className
    )}>
      {icon}
    </div>
  );
};

// Feature card - Mobile optimized
export const FeatureCard = ({
  icon,
  title,
  description,
  className,
  compact = false,
  variant = "blue",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  compact?: boolean;
  variant?: "blue" | "red";
}) => (
  <div className={cn(
    "rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border",
    variant === "blue" ? "border-blue-100" : "border-red-100",
    compact ? "p-4" : "p-6",
    className
  )}>
    <div className={cn(
      "h-10 w-10 rounded-full flex items-center justify-center mb-4 flex-shrink-0",
      variant === "blue" 
        ? "bg-blue-100 text-blue-600" 
        : "bg-red-100 text-red-500"
    )}>
      {icon}
    </div>
    <h3 className={cn(
      "font-semibold mb-2", 
      compact ? "text-base" : "text-lg",
      variant === "blue" ? "text-blue-900" : "text-red-900"
    )}>{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

// Shiny button - Mobile optimized
export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    variant?: "blue" | "red";
  }
>(({ className, children, variant = "blue", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant === "blue" ? "gradient-blue" : "gradient-red"}
    className={cn(
      "overflow-hidden shine-effect min-h-[40px]",
      className
    )}
    {...props}
  >
    {children}
  </Button>
));
ShinyButton.displayName = "ShinyButton";

// Compact score display for cricket scorecard
export const CompactScoreCard = ({
  children,
  className,
  variant = "blue",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "blue" | "red";
}) => (
  <div className={cn(
    "compact-score p-3 rounded-lg border bg-white/90 shadow-sm",
    variant === "blue" ? "border-blue-100" : "border-red-100",
    className
  )}>
    {children}
  </div>
);

// Compact player stat display
export const PlayerStatCard = ({
  name,
  stat,
  secondaryStat,
  className,
  active = false,
}: {
  name: string;
  stat: string | number;
  secondaryStat?: string | number;
  className?: string;
  active?: boolean;
}) => (
  <div className={cn(
    "flex items-center justify-between p-2 rounded border bg-white/80 text-sm",
    active ? "border-blue-300 bg-blue-50/80" : "border-gray-100",
    className
  )}>
    <div className={cn(
      "font-medium truncate pr-2",
      active && "text-blue-700"
    )}>{name}</div>
    <div className="flex items-center space-x-2 text-right">
      <div className={cn(
        "font-semibold tabular-nums",
        active && "text-blue-700"
      )}>{stat}</div>
      {secondaryStat && (
        <div className="text-muted-foreground text-xs tabular-nums">{secondaryStat}</div>
      )}
    </div>
  </div>
);
