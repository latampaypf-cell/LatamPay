import { useAuth } from "../../context/AuthContext";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <section>
      <h1>Bienvenido a LatamPay</h1>
      <p>Hola, {user?.email ?? "usuario"}.</p>

      <article>
        <h2>Tu cuenta</h2>
        <dl>
          <dt>Email</dt>
          <dd>{user?.email ?? "—"}</dd>
        </dl>
      </article>
    </section>
  );
};

export default Dashboard;
