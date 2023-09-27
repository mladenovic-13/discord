import { Profile } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getName(profile: Profile) {
  if (profile.name.includes('null')) {
    return profile.email.split('@')[0];
  }
  return profile.name;
}
