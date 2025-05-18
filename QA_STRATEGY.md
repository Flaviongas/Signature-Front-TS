# QA Strategy - Frontend (React + Vite + Jest)

## Roles y responsabilidades de QA en el Scrum Team

- **QA Lead (Diomedes Mora):**

  - Diseñar y mantener la estrategia de pruebas.
  - Definir Definition of Done y objetivos de calidad.
  - Supervisar el CI/CD y coordinar esfuerzos de QA.
  - Evaluar métricas y liderar retrospectivas de calidad.

- **QA Analyst (Flavio):**

  - Definir casos de prueba funcionales y regresión.
  - Mantener backlog de pruebas y checklist de validaciones.
  - Validar entregables contra criterios de aceptación.

- **QA Automation Engineer (Manuel):**
  - Desarrollar y mantener pruebas automatizadas (Pytest, Jest).
  - Generar reportes de cobertura y alertas de calidad.

## Herramientas

- Jest: pruebas unitarias.
- React Testing Library: pruebas de componentes.
- Axios Mock Adapter: mockeo de llamadas HTTP.
- GitHub Actions: CI para correr tests en cada push.

## Ubicación de tests

- Tests de servicios: `src/services/__tests__/`
- Tests de componentes: `src/components/__tests__/`
- Nomenclatura: `*.test.tsx`, `*.test.ts`

## Estructura mínima esperada

### userService.test.ts

- [ ] Obtener listado de usuarios
- [ ] Crear usuario válido
- [ ] Error al crear usuario sin campos requeridos

### studentService.test.ts

- [ ] Crear estudiante con campos válidos
- [ ] Error por RUT con caracteres inválidos
- [ ] Eliminar estudiante existente
- [ ] Error al eliminar estudiante inexistente
