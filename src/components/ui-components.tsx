
import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { Card as ShadcnCard } from "@/components/ui/card";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

// Enhanced button with animation and press effect
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
      className
    )}
    {...props}
    disabled={isLoading || props.disabled}
  >
    {isLoading && (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    )}
    {!isLoading && iconLeft && (
      <span className="mr-2">{iconLeft}</span>
    )}
    <span className="transition-all-200">{children}</span>
    {!isLoading && iconRight && (
      <span className="ml-2">{iconRight}</span>
    )}
  </ShadcnButton>
));
Button.displayName = "Button";

// Next button with arrow
export const NextButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...props }, ref) => (
  <Button
    ref={ref}
    iconRight={<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />}
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

// Back button with arrow
export const BackButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    iconLeft={<ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />}
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

// Glass Card component
export const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ShadcnCard> & {
    hoverEffect?: boolean;
    glowEffect?: boolean;
  }
>(({ className, children, hoverEffect = true, glowEffect = false, ...props }, ref) => (
  <ShadcnCard
    ref={ref}
    className={cn(
      "glass-card border-white/20 bg-white/80 backdrop-blur-lg",
      hoverEffect && "hover:shadow-card hover:border-white/30 transition-all-300",
      glowEffect && "cricket-glow",
      className
    )}
    {...props}
  >
    {children}
  </ShadcnCard>
));
GlassCard.displayName = "GlassCard";

// Form Input with label
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
      <Label htmlFor={id} className="text-sm font-medium flex items-center">
        {label}
      </Label>
    )}
    <div className="relative">
      {iconLeft && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {iconLeft}
        </div>
      )}
      <ShadcnInput
        ref={ref}
        id={id}
        className={cn(
          "transition-all-200 shadow-input focus:shadow-none",
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

// Page transition wrapper
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

// Section title component
export const SectionTitle = ({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) => (
  <div className={cn("space-y-1 text-center mb-6", className)}>
    <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
    {subtitle && (
      <p className="text-muted-foreground text-sm text-balance max-w-sm mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

// Page container with background
export const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    "gradient-bg min-h-screen flex flex-col items-center justify-center p-6",
    className
  )}>
    {children}
  </div>
);

// Card with hover effect
export const HoverCard = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    className={cn(
      "rounded-xl p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

// Animated badge
export const AnimatedBadge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    "inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary animate-bounce-subtle",
    className
  )}>
    {children}
  </div>
);

// Icon with background
export const IconBackground = ({
  icon,
  className,
}: {
  icon: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary",
    className
  )}>
    {icon}
  </div>
);

// Feature card
export const FeatureCard = ({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) => (
  <div className={cn(
    "p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100",
    className
  )}>
    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

// Shiny button
export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn(
      "bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden shine-effect",
      className
    )}
    {...props}
  >
    {children}
  </Button>
));
ShinyButton.displayName = "ShinyButton";
