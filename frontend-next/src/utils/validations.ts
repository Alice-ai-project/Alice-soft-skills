const EMAIL_MAX = 50;
const PASSWORD_MIN = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required.";
  if (value.length > EMAIL_MAX) return `Email must be at most ${EMAIL_MAX} characters.`;
  if (!EMAIL_PATTERN.test(value))
    return "Enter a valid email address (e.g. user@gmail.com).";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Password is required.";
  if (value.length < PASSWORD_MIN)
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  return null;
}
