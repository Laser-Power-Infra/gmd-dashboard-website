import { Archivo } from 'next/font/google';

/**
 * Catalogue and orders type: one family, Archivo, whose width axis carries the personality -
 * condensed heavy numerals for bore and pressure (like cast body markings),
 * normal width for everything else.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});
