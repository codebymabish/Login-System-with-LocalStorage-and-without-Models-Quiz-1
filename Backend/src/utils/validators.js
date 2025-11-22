export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  if (!password || typeof password !== "string") return false;

  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  );
};

// ✅ Now takes req.body as a single object
export const validateSignupInput = ({ email, password, fullName }) => {
  const errors = {};

  if (!fullName || fullName.trim().length === 0)
    errors.fullName = "Full name is required";

  if (!validateEmail(email)) errors.email = "Invalid email format";

  if (!validatePassword(password))
    errors.password =
      "Password must be at least 6 characters long and include uppercase, lowercase, numbers, and special characters";

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateLoginInput = ({ email, password }) => {
  const errors = {};

  if (!validateEmail(email)) errors.email = "Invalid email format";
  if (!password || password.trim().length === 0)
    errors.password = "Password is required";

  return { isValid: Object.keys(errors).length === 0, errors };
};
