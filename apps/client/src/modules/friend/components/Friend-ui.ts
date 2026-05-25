import type { Profile } from '../store/friend';

export function fullName(profile: Profile) {
  const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  return name || profile.email || 'Traveler';
}

export function initials(profile: Profile) {
  const first = profile.first_name?.[0] || '';
  const last = profile.last_name?.[0] || '';

  return `${first}${last}`.toUpperCase() || 'TR';
}

export function avatarClass(index: number) {
  const classes = [
    'bg-emerald-700',
    'bg-purple-500',
    'bg-pink-500',
    'bg-blue-600',
    'bg-amber-500',
    'bg-teal-500',
  ];

  return classes[index % classes.length];
}