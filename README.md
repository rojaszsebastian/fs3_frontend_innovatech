# 🚀 Innovatech Solutions - Frontend (Interfaz de Usuario)

Esta aplicación es la interfaz visual del ecosistema de **InnovaTech**. 

Proporciona una consola administrativa moderna, responsiva e interactiva para la visualización del dashboard unificado, la gestión de la carga horaria, la asignación de recursos y el monitoreo de alertas de sobrecarga o baja asignación.

---

## 🏗️ Arquitectura de Software

La aplicación implementa patrones modernos de desarrollo frontend para garantizar una mantenibilidad y rendimiento óptimos:

*   **Single Page Application (SPA) & Routing:** Implementa un sistema de rutas declarativo mediante **React Router**, utilizando una estructura de plantilla centralizada (`MainLayout` y `<Outlet />`) para permitir una navegación instantánea y fluida sin recargas del navegador.
*   **Reactividad de Estados:** El dashboard y sus diferentes paneles (Proyectos, Empleados, Notificaciones) actualizan sus estados de manera reactiva mediante hooks (`useState`, `useEffect`). Cualquier interacción del usuario en la reasignación de horas o lectura de alertas sincroniza en tiempo real los cambios con el orquestador BFF.
*   **Capa de Servicios Desacoplada (Service Layer):** Aísla por completo la lógica de negocio y las llamadas REST de la presentación de los componentes React. Los servicios HTTP se definen en `src/services/` y consumen un cliente centralizado de **Axios** en `src/api/dashboardApi.js`, el cual implementa interceptores globales de error y límites de timeout.

---

## 🛠️ Stack Tecnológico

*   **Librería Principal:** React 18+ (Hooks API)
*   **Estilos y UI:** Bootstrap 5.3+ (Diseño responsivo móvil-primero)
*   **Cliente API:** Axios (Con interceptores para control de timeouts y caídas del BFF)
*   **Iconografía:** Lucide React
*   **Enrutador:** React Router

---

## 🚀 Guía de Despliegue y Ejecución

### 📋 Prerrequisitos

*   Node.js v18.x o superior (si ejecuta de manera local)
*   npm v9.x o superior
*   El **BFF (Backend For Frontend)** debe estar operativo y disponible en el puerto **`8080`**.

### 🐳 Ejecución con Docker

El proyecto incluye un entorno de compilación multi-etapa y un servidor de producción Nginx optimizado.

1. En la raíz de `fs3_frontend_innovatech`, ejecute:
   ```bash
   docker compose up -d --build
   ```
2. **Acceso:** Abra su navegador e ingrese a `http://localhost:3000`.

### 💻 Ejecución Local (Desarrollo)

Para iniciar el servidor de desarrollo local con recarga en caliente (Hot Reload):

1. Instale las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Ejecute la aplicación en modo desarrollo:
   ```bash
   npm start
   ```
3. El frontend se abrirá automáticamente en `http://localhost:3000`.

*Nota: La API por defecto apunta a `http://127.0.0.1:8080/api` mediante Axios.*

---

## 🧪 Ejecución de Pruebas Unitarias

La cobertura de pruebas unitarias de los servicios y la UI se encuentra garantizada dentro del rango del **60% al 75%** utilizando Jest y React Testing Library.

Para ejecutar los tests de forma interactiva (modo watch):
```bash
npm test
```

Para ejecutar todos los tests y generar el informe de cobertura JaCoCo/Jest localmente (ejecución única):
```bash
npm run test:coverage
```
El reporte se generará en la carpeta `coverage/`.

---

## 🔌 Consumo de Servicios (Contrato BFF)

La capa de servicios del frontend interactúa de manera directa con los siguientes endpoints expuestos por el BFF:

*   **Dashboard:** `GET /api/dashboard/resumen?proyectoId={pId}&recursoId={rId}`
*   **Recursos (Empleados):**
    *   `GET /api/empleados`
    *   `GET /api/empleados/{id}`
    *   `POST /api/empleados`
    *   `PUT /api/empleados/{id}`
    *   `DELETE /api/empleados/{id}`
*   **Proyectos:**
    *   `GET /api/proyectos`
    *   `GET /api/proyectos/{id}`
    *   `POST /api/proyectos`
    *   `PUT /api/proyectos/{id}`
    *   `DELETE /api/proyectos/{id}`
*   **Asignaciones:**
    *   `GET /api/asignaciones/proyecto/{proyectoId}`
    *   `POST /api/asignaciones`
    *   `PUT /api/asignaciones/{id}`
    *   `DELETE /api/asignaciones/proyecto/{proyectoId}/empleado/{empleadoId}`
*   **Notificaciones:**
    *   `GET /api/notificaciones`
    *   `PUT /api/notificaciones/{id}/leer`

---

© 2026 Innovatech Solutions - Ingeniería Civil Informática - Documentación Técnica (EV2)