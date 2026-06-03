# Sistema de rutas

Documentación del flujo de navegación y control de acceso.

## Estructura

```
src/
├── context/
│   └── AuthContext.tsx       # Estado global de autenticación
├── layouts/
│   └── PrivateLayout.tsx     # Header común para rutas privadas
├── routes/
│   ├── AppRouter.tsx         # Definición central de rutas
│   ├── paths.ts              # Constantes de paths (única fuente)
│   └── guards/
│       ├── PrivateRoute.tsx  # Bloquea rutas privadas
│       └── PublicRoute.tsx   # Bloquea rutas públicas a logueados
└── pages/                    # Componentes-pantalla
```

## Layout privado

Todas las rutas privadas se renderizan dentro de `PrivateLayout`, que provee un header común con el email del usuario y el botón "Cerrar sesión". Las pantallas privadas solo se preocupan por su contenido — el chrome de la app lo pone el layout.

El orden de anidado en el router es:

```
<PrivateRoute>   ← decide si dejar pasar
  <PrivateLayout>  ← pinta el header
    <Dashboard />  ← contenido de la ruta
```

## AuthContext

Provee a toda la app el estado de autenticación:

| Campo | Tipo | Descripción |
|---|---|---|
| `token` | `string \| null` | JWT (hoy mockeado) persistido en `localStorage`. |
| `user` | `AuthUser \| null` | Datos del usuario logueado. |
| `isAuthenticated` | `boolean` | `true` si hay token. |
| `isLoading` | `boolean` | `true` mientras se hidrata desde `localStorage`. |
| `login(email, password)` | `Promise<void>` | Hoy genera token mock. A futuro hará `POST /auth/login`. |
| `logout()` | `void` | Limpia token y estado. |

Consumo:

```tsx
import { useAuth } from "../context/AuthContext";

const { isAuthenticated, login, logout } = useAuth();
```

> Llamar `useAuth()` fuera de `<AuthProvider>` lanza un error.

## Guards

Ambos son **layout routes**: se usan envolviendo rutas hijas con `<Outlet />`.

### PrivateRoute

- Si `isLoading` → no renderiza nada (evita parpadeo en refresh).
- Si NO está autenticado → redirige a `/login`, guardando la ruta intentada en `location.state.from`.
- Si está autenticado → renderiza la ruta hija.

### PublicRoute

- Si `isLoading` → no renderiza nada.
- Si está autenticado → redirige a `/dashboard`.
- Si no → renderiza la ruta hija.

## Mapa de rutas actual

| Path | Acceso | Componente |
|---|---|---|
| `/` | Libre | `Home` |
| `/login` | Solo no autenticados | `Login` |
| `/register` | Solo no autenticados | `Register` |
| `/dashboard` | Solo autenticados | `Dashboard` |
| `*` | Libre | `NotFound` (404) |

## Cómo agregar una ruta

### Privada

```tsx
// AppRouter.tsx
<Route element={<PrivateRoute />}>
  <Route element={<PrivateLayout />}>
    <Route path={paths.dashboard} element={<Dashboard />} />
    <Route path={paths.profile}   element={<Profile />} />   // ← nueva
  </Route>
</Route>
```

Y agregar `profile: "/profile"` en `paths.ts`.

### Pública (login/registro/recuperar)

```tsx
<Route element={<PublicRoute />}>
  <Route path={paths.login}    element={<Login />} />
  <Route path={paths.register} element={<Register />} />
  <Route path={paths.forgot}   element={<ForgotPassword />} />  // ← nueva
</Route>
```

### Libre (accesible siempre)

```tsx
<Route path={paths.about} element={<About />} />
```

## Flujo de autenticación

```
┌────────────────────────┐
│  Usuario no autenticado │
└────────────┬───────────┘
             │
             ├── visita /        → Home (OK)
             ├── visita /login   → Login (OK)
             ├── visita /register→ Register (OK)
             └── visita /dashboard → redirect a /login
                                     (guarda `from` en state)

         [ submit login/register ]
                    │
            login(email, pwd)
                    │
            localStorage ← token
                    │
            navigate(/dashboard)

┌────────────────────────┐
│   Usuario autenticado   │
└────────────┬───────────┘
             │
             ├── visita /         → Home (OK, sigue libre)
             ├── visita /login    → redirect a /dashboard
             ├── visita /register → redirect a /dashboard
             ├── visita /dashboard→ Dashboard (OK)
             └── click "Cerrar sesión" → logout() → vuelve al estado no autenticado
```

## Notas para el equipo

- **Login (pantalla)**: cuando se implemente, el submit debe llamar a `login(email, password)` del `useAuth()` y luego `navigate(paths.dashboard, { replace: true })`. Si querés volver al lugar que el usuario quería visitar antes del rebote, usá `const from = location.state?.from?.pathname ?? paths.dashboard`.
- **Migración a JWT real**: solo cambia el cuerpo de `login()` y la hidratación en `AuthContext.tsx`. La interfaz (`isAuthenticated`, `login`, `logout`) ya está estable, ningún consumidor se entera.
- **Token key**: la constante `TOKEN_STORAGE_KEY` vive solo en `AuthContext.tsx`. Si hace falta acceder al token desde fuera (ej. interceptor de fetch), exportarla desde ahí y reutilizarla — nunca hardcodear el string.
