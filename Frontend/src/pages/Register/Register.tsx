import { useState } from "react";
import { Link } from "react-router-dom";
import { Form } from "../../components/forms/Form";

// comentario prueba
export const Register = () => {
  const [registered, setRegistered] = useState(false);

  const handleSuccess = (data: unknown) => {
    console.log("Usuario registrado:", data);
    setRegistered(true);
  };

  if (registered) {
    return (
      <main>
        <h1>Cuenta creada</h1>
        <p>Tu cuenta fue creada con éxito. Ya podés iniciar sesión.</p>
        <Link to="/login">Ir al login</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Crear cuenta</h1>
      <p>Registrate con tu email y una contraseña.</p>

      <Form
        onSuccess={handleSuccess}
        submitLabel="Registrarme"
      />

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </main>
  );
};
