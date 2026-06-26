export const NAME_MAX = 50;
export const EMAIL_MAX = 50;
export const PASSWORD_MIN = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value: string, label = "Name"): string | null {
  if (!value.trim()) return `${label} is required.`;
  if (value.length > NAME_MAX) return `${label} must be at most ${NAME_MAX} characters.`;
  return null;
}

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

export function validateConfirmEmail(
  email: string,
  confirmEmail: string,
): string | null {
  if (!confirmEmail.trim()) return "Please confirm your email.";
  if (email !== confirmEmail) return "Emails do not match.";
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}
