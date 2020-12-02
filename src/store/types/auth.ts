export interface AuthState {
  sessionExpiration: string | null;
  token: string | null;
  refreshToken: string | null;
}

// SIGN IN

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TLoginSucceededPayload = {
  sessionExpiration: string;
  token: string;
  refreshToken: string;
};

export type TLoginFailurePayload = {
  [key in keyof TLoginPayload]?: {
    [key: string]: string;
  };
} & {
  code: string;
};

// SIGN UP

export enum DocumentType {
  CPF = 'cpf',
  PASSPORT = 'passport',
}

export type SignUpPayload = {
  countryCode: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  documentType: DocumentType;
  documentNumber: string;
  password: string;
  addressLine1: string;
  addressLine2: string;
};

export type SignUpFailurePayload = {
  // Temporary "?"
  [key in keyof SignUpPayload]?: Array<string>;
} & {
  code: string;
};

// Verification Code

export type TVerificationCodePayload = {
  phone?: string;
  email?: string;
  confirmationCode: string;
};

export type TVerificationCodeFailurePayload = {
  [key in keyof TVerificationCodePayload]?: {
    [key: string]: string;
  };
} & {
  code: string;
};

// signInViaBookingID
/**
 * @TODO add response type for this flow
 * @TODO add error type for this flow
 */
export type TSignInViaBookingIDPayload = {
  bookingID: string;
  email: string;
};

// remindBookingID
/**
 * @TODO add response type for this flow
 * @TODO add error type for this flow
 */
export type TRemindBookingIDPayload = {
  email: string;
  origin: string;
  destination: string;
  departureDate: moment.Moment;
};
