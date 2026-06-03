import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../routes/paths";
import { privateNavItems } from "../../routes/nav";
import type { NavItem } from "../../routes/nav";

export type PrivateNavbarProps = {
  /** Items de navegación a renderizar. Por default usa los privados de la app. */
  items?: NavItem[];
  /** Texto/Logo del brand. */
  brand?: string;
};

// ============================================================
// NOTA: Componente sin estilos por ahora. La mecánica del menú
// hamburguesa (isMenuOpen + botón toggle + aria-expanded) ya está
// implementada. Cuando se agregue PrivateNavbar.css solo hay que:
//   1. Ocultar `.private-navbar__toggle` en desktop (@media min-width).
//   2. Ocultar `.private-navbar__menu` en mobile cuando NO tenga
//      la clase `is-open`.
//   3. Estilar `.private-navbar__menu .active` (lo agrega NavLink).
// Hoy todos los elementos se ven juntos porque no hay CSS.
// ============================================================
export function PrivateNavbar({
  items = privateNavItems,
  brand = "LatamPay",
}: PrivateNavbarProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="private-navbar" aria-label="Navegación principal">
      <div className="private-navbar__brand">
        <Link to={paths.dashboard} onClick={closeMenu}>
          {brand}
        </Link>
      </div>

      {/* TODO responsive: ocultar en desktop vía CSS @media (min-width: 768px) */}
      <button
        type="button"
        className="private-navbar__toggle"
        aria-expanded={isMenuOpen}
        aria-controls="private-navbar-menu"
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={toggleMenu}
      >
        ☰
      </button>

      <ul
        id="private-navbar-menu"
        className={`private-navbar__menu ${isMenuOpen ? "is-open" : ""}`}
      >
        {items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="private-navbar__user">
        <span className="private-navbar__user-email">{user?.email}</span>
        <button
          type="button"
          className="private-navbar__logout"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default PrivateNavbar;
