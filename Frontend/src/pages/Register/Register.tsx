import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "../../components/forms/Form";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../routes/paths";
import type { FormSuccessPayload } from "../../types/formLogin_register.types";

function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "El nombre es obligatorio.";
  if (trimmed.length < 2) return "Debe tener al menos 2 caracteres.";
  if (trimmed.length > 100) return "El nombre es demasiado largo.";
  return undefined;
}

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const nameError = validateName(name);

  const handleSuccess = async ({ values }: FormSuccessPayload) => {
    await login(values.email, values.password);
    navigate(paths.dashboard, { replace: true });
  };

  return (
    <main>
      <h1>Crear cuenta</h1>
      <p>Registrate con tu nombre, email y una contraseña.</p>

      <Form
        onSuccess={handleSuccess}
        submitLabel="Registrarme"
        extraValues={{ name: name.trim() }}
        disableSubmit={Boolean(nameError)}
      >
        <div>
          <label htmlFor="register-name">Nombre</label>
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            aria-invalid={Boolean(nameError && nameTouched)}
            aria-describedby={nameError && nameTouched ? "register-name-error" : undefined}
            required
          />
          {nameError && nameTouched && (
            <p id="register-name-error" role="alert">
              {nameError}
            </p>
          )}
        </div>
      </Form>

      <p>
        ¿Ya tenés cuenta? <Link to={paths.login}>Iniciar sesión</Link>
      </p>
    </main>
  );
};

export default Register;
