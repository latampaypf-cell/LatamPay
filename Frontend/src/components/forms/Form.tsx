import { useState } from "react";

export type RegisterFormValues = {
  email: string;
  password: string;
};

type RegisterFormErrors = {
  email?: string;
  password?: string;
};

type FormProps = {
  endpoint: string;
  onSuccess?: (data: unknown) => void;
  submitLabel?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "El email es obligatorio.";
  if (trimmed.length > 254) return "El email es demasiado largo.";
  if (!EMAIL_REGEX.test(trimmed)) return "Ingresá un email válido.";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "La contraseña es obligatoria.";
  if (value.length < 8) return "Debe tener al menos 8 caracteres.";
  if (value.length > 72) return "No puede superar los 72 caracteres.";
  if (!/[A-Z]/.test(value)) return "Debe incluir al menos una letra mayúscula.";
  if (!/[a-z]/.test(value)) return "Debe incluir al menos una letra minúscula.";
  if (!/[0-9]/.test(value)) return "Debe incluir al menos un número.";
  return undefined;
}

export function Form({
  endpoint,
  onSuccess,
  submitLabel = "Crear cuenta",
}: FormProps) {
  const [values, setValues] = useState<RegisterFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof RegisterFormValues, boolean>>({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const runValidation = (next: RegisterFormValues): RegisterFormErrors => ({
    email: validateEmail(next.email),
    password: validatePassword(next.password),
  });

  const handleChange =
    (field: keyof RegisterFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      if (touched[field]) {
        setErrors(runValidation(next));
      }
    };

  const handleBlur = (field: keyof RegisterFormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(runValidation(values));
  };

  async function handleSubmit() {
    setServerError(null);

    const nextErrors = runValidation(values);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    if (Object.values(nextErrors).some(Boolean)) return;

    const payload: RegisterFormValues = {
      email: values.email.trim(),
      password: values.password,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && "message" in data && typeof (data as { message: unknown }).message === "string"
            ? (data as { message: string }).message
            : null) ?? "No pudimos crear la cuenta. Intentá de nuevo.";
        setServerError(message);
        return;
      }

      setValues({ email: "", password: "" });
      setTouched({ email: false, password: false });
      onSuccess?.(data);
    } catch {
      setServerError("Error de red. Verificá tu conexión.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <div>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          aria-invalid={Boolean(errors.email && touched.email)}
          aria-describedby={errors.email && touched.email ? "register-email-error" : undefined}
          disabled={isSubmitting}
          required
        />
        {errors.email && touched.email && (
          <p id="register-email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password">Contraseña</label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
          aria-invalid={Boolean(errors.password && touched.password)}
          aria-describedby={errors.password && touched.password ? "register-password-error" : undefined}
          disabled={isSubmitting}
          required
        />
        {errors.password && touched.password && (
          <p id="register-password-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {serverError && (
        <p id="register-server-error" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : submitLabel}
      </button>
    </form>
  );
}

export default Form;
