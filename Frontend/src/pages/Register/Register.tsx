import { Link, useNavigate } from "react-router-dom";
import { Form } from "../../components/forms/Form";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../routes/paths";
import type { FormSuccessPayload } from "../../types/formLogin_register.types";

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async ({ values }: FormSuccessPayload) => {
    await login(values.email, values.password);
    navigate(paths.dashboard, { replace: true });
  };

  return (
    <main>
      <h1>Crear cuenta</h1>
      <p>Registrate con tu email y una contraseña.</p>

      <Form onSuccess={handleSuccess} submitLabel="Registrarme" />

      <p>
        ¿Ya tenés cuenta? <Link to={paths.login}>Iniciar sesión</Link>
      </p>
    </main>
  );
};

export default Register;
