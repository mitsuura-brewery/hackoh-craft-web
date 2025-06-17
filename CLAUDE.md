# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS 4.

### Key Technologies
- **Next.js 15** with App Router architecture
- **React 19** with TypeScript
- **Tailwind CSS 4** with PostCSS integration
- **ESLint** with Next.js and TypeScript rules

### Project Structure
- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with Geist fonts
- `src/app/page.tsx` - Home page
- `src/app/globals.css` - Global styles with Tailwind and custom CSS variables
- `public/` - Static assets

### Styling Setup
- Uses Tailwind CSS 4 with inline theme configuration
- Custom CSS variables for colors and fonts defined in globals.css
- Automatic dark mode support via `prefers-color-scheme`
- Geist Sans and Geist Mono fonts loaded from Google Fonts

### Styling Rule
- Avoid writing CSS `style` directly unless necessary.
- Define styles in `className` using `TailwindCSS`.
- Switch dynamic classes using the `cn` function.

### TypeScript Configuration
- Path aliases configured with `@/*` pointing to `./src/*`
- Strict mode enabled
- Next.js TypeScript plugin integrated
