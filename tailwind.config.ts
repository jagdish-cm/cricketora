
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				cricket: {
					primary: '#1E90FF',
					secondary: '#F0F7FF',
					accent: '#0070F3',
					muted: '#F5F8FC',
					dark: '#0A1F44',
					green: '#34D399',
					yellow: '#FBBF24',
					red: '#F87171',
					purple: '#8B5CF6',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' },
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(30, 144, 255, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(30, 144, 255, 0.8)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'scale-in': 'scale-in 0.3s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(20px)',
			},
			boxShadow: {
				'subtle': '0 4px 12px rgba(0, 0, 0, 0.05)',
				'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
				'card': '0 4px 24px rgba(0, 0, 0, 0.05)',
				'input': '0 2px 4px rgba(0, 0, 0, 0.05)',
				'glow': '0 0 15px rgba(30, 144, 255, 0.5)',
			},
			backgroundImage: {
				'cricket-pattern': "url('/cricket-pattern.svg')",
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-cricket': 'linear-gradient(135deg, #E6F0FD 0%, #F0F7FF 50%, #F5F8FC 100%)',
				'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.glass-morphism': {
					'background': 'rgba(255, 255, 255, 0.7)',
					'backdrop-filter': 'blur(10px)',
					'border': '1px solid rgba(255, 255, 255, 0.2)',
					'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.05)',
				},
				'.glass-card': {
					'background': 'rgba(255, 255, 255, 0.6)',
					'backdrop-filter': 'blur(12px)',
					'border-radius': '16px',
					'border': '1px solid rgba(255, 255, 255, 0.3)',
					'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.03)',
				},
				'.text-shadow-sm': {
					'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
				},
				'.text-shadow': {
					'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
				},
				'.text-shadow-lg': {
					'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)',
				},
				'.transition-all-200': {
					'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				},
				'.transition-all-300': {
					'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				},
				'.transition-transform-200': {
					'transition': 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				},
				'.transition-opacity-200': {
					'transition': 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				},
				'.cricket-glow': {
					'box-shadow': '0 0 15px rgba(30, 144, 255, 0.5)',
					'transition': 'box-shadow 0.3s ease',
				},
				'.cricket-glow:hover': {
					'box-shadow': '0 0 25px rgba(30, 144, 255, 0.8)',
				},
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
