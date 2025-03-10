
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
    iconRight={<ArrowRight className="h-4 w-4" />}
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
    iconLeft={<ArrowLeft className="h-4 w-4" />}
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
  }
>(({ className, children, hoverEffect = true, ...props }, ref) => (
  <ShadcnCard
    ref={ref}
    className={cn(
      "glass-card border-white/20 bg-white/80 backdrop-blur-lg",
      hoverEffect && "hover:shadow-card hover:border-white/30 transition-all-300",
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
  }
>(({ className, label, error, id, ...props }, ref) => (
  <div className="space-y-2">
    {label && (
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
    )}
    <ShadcnInput
      ref={ref}
      id={id}
      className={cn(
        "transition-all-200 shadow-input focus:shadow-none",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
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
