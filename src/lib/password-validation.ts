export const PASSWORD_MIN_LENGTH = 6
export const PASSWORD_HINT = "Password minimal 6 karakter."

export function isValidPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH && value.trim().length > 0
}

export const NEW_PASSWORD_INPUT_PROPS = {
  type: "password",
  autoComplete: "new-password",
  minLength: PASSWORD_MIN_LENGTH,
} as const
