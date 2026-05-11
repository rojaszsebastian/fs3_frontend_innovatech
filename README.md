# 🚀 Innovatech Solutions - Frontend (Interfaz de Usuario)

Esta aplicación es el punto de interacción final del ecosistema de Innovatech Solutions.  
Proporciona una interfaz administrativa moderna, reactiva y eficiente para la gestión de proyectos y talento humano, diseñada bajo estándares de alto rendimiento y escalabilidad.

---

## 🏗️ Arquitectura de Software

La aplicación implementa patrones avanzados de desarrollo frontend para garantizar una experiencia de usuario fluida (UX) y una arquitectura mantenible:

### Single Page Application (SPA) & Routing

Utiliza un sistema de enrutamiento dinámico con **React Router**.  
Implementa un patrón de layout centralizado mediante `MainLayout` y componentes tipo `Outlet`, permitiendo navegación instantánea sin recargas de página.

### Reactividad y Estado Sincronizado

El dashboard implementa un motor de búsqueda reactivo basado en hooks (`useState`, `useEffect`).  
Al detectar cambios en los parámetros de entrada (ID Proyecto/Recurso), el sistema sincroniza automáticamente la vista con el orquestador BFF, garantizando datos en tiempo real.

### Desacoplamiento de Consumo (Service Layer)

Aísla la lógica de las peticiones HTTP del renderizado de componentes.  
Mediante una capa de servicios (`dashboardService.js`) y una instancia centralizada de Axios (`dashboardApi.js`), se gestionan interceptores de red y tiempos de espera (`timeout`) de forma global.

---

## 🛠️ Stack Tecnológico

- **Librería Principal:** React 19+ (Hooks API)
- **Estilos y UI:** Bootstrap 5.3+ (responsive y mobile-first)
- **Gestión de Red:** Axios con soporte para promesas y cancelación de peticiones
- **Iconografía:** Lucide React
- **Navegación:** React Router 7.x

---

## 🚀 Guía de Despliegue y Ejecución

### 📋 Prerrequisitos

- Node.js v18.x o superior
- npm v9.x o superior
- BFF Orquestador operativo en el puerto **8080**

---

### ⚡ Arranque del Entorno

#### Instalación de dependencias

```bash
npm install
```

### Ejecución del servidor de desarrollo

```bash
npm start
```

## 🧪 Consumo de Datos (Contrato BFF)

El frontend consume el endpoint de agregación asíncrona para proyectar el resumen ejecutivo.

- **Endpoint Consumido:** `GET /api/dashboard/resumen`

### Contrato de Interfaz

- `nombreProyecto`: String
- `totalHoras`: Integer
- `capacidadResponsable`: Double *(Dato dinámico desde MS RRHH)*

---

## 🛡️ Estándares de Seguridad y Gobernanza

- **Manejo de Errores Resiliente:** Estados visuales de *carga* y *error* para evitar colapsos de la UI
- **Seguridad en Variables:** Uso de prefijos `REACT_APP_` para endpoints sensibles
- **Validación de Tipos:** Renderizado condicional para evitar errores `null` o `undefined`

---

© 2026 Innovatech Solutions - Ingeniería Civil Informática - Documentación Técnica (EV2)