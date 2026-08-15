import type { Person } from '#lib/types.js';

// Age in whole years on `referenceDate`. Returns null if either date is
// empty or unparseable.
export function ageOnDate(dob: string, referenceDate: string): number | null {
  if (!dob || !referenceDate) return null;
  const birth = new Date(dob);
  const ref = new Date(referenceDate);
  if (Number.isNaN(birth.valueOf()) || Number.isNaN(ref.valueOf())) return null;
  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

// Today as 'YYYY-MM-DD'.
export function todayIso(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Compare two names case-insensitively after trimming. Empty strings
// never match — empty values cannot prove identity.
export function namesEqual(a: string, b: string): boolean {
  const lhs = a.trim().toLowerCase();
  const rhs = b.trim().toLowerCase();
  if (!lhs || !rhs) return false;
  return lhs === rhs;
}

// Two Person records are considered the same person when first names,
// last name, and date-of-birth all match. Used to detect overlaps such
// as "certificate provider is also an attorney".
export function personEquals(a: Person, b: Person): boolean {
  if (a.id && b.id && a.id === b.id) return true;
  if (!a.dateOfBirth || !b.dateOfBirth) return false;
  if (a.dateOfBirth !== b.dateOfBirth) return false;
  return (
    namesEqual(a.firstNames, b.firstNames) && namesEqual(a.lastName, b.lastName)
  );
}

// Is the person identifiable by any of the populated fields? Used to
// decide whether to treat a Person record as "filled in".
export function personIsPopulated(p: Person | null | undefined): boolean {
  if (!p) return false;
  return (
    !!p.firstNames.trim() ||
    !!p.lastName.trim() ||
    !!p.dateOfBirth ||
    !!p.email ||
    !!p.address.addressLine1.trim()
  );
}
