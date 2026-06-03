export type RegisterFormValues = {
  email: string;
  password: string;
};

export type RegisterFormErrors = {
  email?: string;
  password?: string;
};

export type FormProps = {
  endpoint: string;
  onSuccess?: (data: unknown) => void;
  submitLabel?: string;
};
