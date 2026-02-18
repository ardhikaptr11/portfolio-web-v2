import {
  Geist,
  Inter,
  JetBrains_Mono,
  Lexend,
  Plus_Jakarta_Sans
} from 'next/font/google';

import { cn } from '@/lib/utils';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const fontLexend = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const fontJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

export const fontVariablesMain = cn(
  fontLexend.variable,
  fontJakarta.variable,
  fontMono.variable
);

export const fontVariablesDashboard = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  fontLexend.variable,
  fontJakarta.variable
);