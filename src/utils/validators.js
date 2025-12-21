import * as Yup from 'yup';

// Email validation schema
export const emailSchema = Yup.string()
  .email('Invalid email address')
  .required('Email is required');

// Password validation schema
export const passwordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )
  .required('Password is required');

// Phone validation schema
export const phoneSchema = Yup.string()
  .matches(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .required('Phone number is required');

// Login validation schema
export const loginValidationSchema = Yup.object({
  email: emailSchema,
  password: Yup.string().required('Password is required'),
});

// Registration validation schema
export const registrationValidationSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
});

// Profile setup validation schema
export const profileSetupValidationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  organization: Yup.string()
    .min(2, 'Organization must be at least 2 characters')
    .required('Organization is required'),
  phone: phoneSchema,
  dietaryPreferences: Yup.string(),
  emergencyContact: Yup.string()
    .min(10, 'Emergency contact must be at least 10 characters')
    .required('Emergency contact is required'),
});

// Profile update validation schema
export const profileUpdateValidationSchema = Yup.object({
  displayName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Display name is required'),
  organization: Yup.string().min(2, 'Organization must be at least 2 characters'),
  phone: Yup.string()
    .matches(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits'),
  dietaryPreferences: Yup.string(),
  emergencyContact: Yup.string(),
});

// Message validation schema
export const messageValidationSchema = Yup.object({
  message: Yup.string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message is too long (max 1000 characters)')
    .required('Message is required'),
});

// Validate email
export const validateEmail = (email) => {
  try {
    emailSchema.validateSync(email);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

// Validate password
export const validatePassword = (password) => {
  try {
    passwordSchema.validateSync(password);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

// Validate phone
export const validatePhone = (phone) => {
  try {
    phoneSchema.validateSync(phone);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};
