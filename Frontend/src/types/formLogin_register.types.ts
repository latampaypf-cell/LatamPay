export type RegisterFormValues = {
  email: string;
  password: string;
};

export type RegisterFormErrors = {
  email?: string;
  password?: string;
};

export type FormSuccessPayload = {
  values: RegisterFormValues;
  data: unknown;
};

export type FormProps = {
  onSuccess?: (payload: FormSuccessPayload) => void;
  submitLabel?: string;
};
