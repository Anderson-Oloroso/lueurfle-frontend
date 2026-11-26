# `lueurfle-frontend`

> Interfaz web modular para **Lueur FLE**, construida con **HTML5 semántico**, **CSS3 con paleta cálida bitema (claro/oscuro)**, **toggle estricto Español / Inglés (`ES / EN`)** y **JavaScript Vanilla 100% Orientado a Objetos (ES Modules)**.

---

## Objetivo

Ofrecer una experiencia cálida, accesible y modular para estudiar **únicamente francés** en 3 fases (`/basico`, `/intermedio`, `/avanzado`) con el tutor **Lueur** (personalidad **OCEAN**), cargar archivos `docs.pdf` hacia **Qdrant** e inspeccionar los rasgos pedagógicos del asistente.

---

## Tecnologías e Identidad Visual

- **HTML5 semántico:** `<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<article>`, `<footer>`, skip link y atributos ARIA.
- **CSS3:** variables semánticas en `css/variables.css` adoptando la paleta cálida **Lotus Neo** (`#E63946` / `#FF6B35` / `#FFD166`, modo claro `#FFFFFF` / `#0F172A` y modo oscuro `#0B0F19` / `#F8FAFC`) + diseño *Mobile-First*.
- **Identidad SVG (`assets/`):** `lueur-icon.svg` (favicon), `lueur-logo-light.svg` y `lueur-logo-dark.svg`.
- **JavaScript Vanilla OOP (ESM):** `LueurApp`, `I18nManager` (`es` / `en` únicamente), `ThemeManager`, `ApiClient`, `CommandHelper`, vistas (`WelcomeView`, `ChatView`, `CommandMenuView`, `LibraryView`, `LevelGuideView`) y controladores (`ChatController`, `UploadController`).
- **Servidor local y contenedor:** `scripts/dev-server.js` (Node.js estándar) y `Dockerfile` (`nginx:alpine`).

---

## Pantallas Modulares

1. **Inicio (`#view-welcome`):** presentación de Lueur y selector directo de fase (`/basico`, `/intermedio`, `/avanzado`).
2. **Tutor Chat (`#view-chat`):** conversación multi-turno con autocompletado interactivo al escribir `/`, badges CEFR y fuentes RAG de Qdrant.
3. **Base PDF · Qdrant (`#view-library`):** carga drag-and-drop de `docs.pdf`, métricas de la colección `lueurfle_french_3072` y listado de documentos detectados.
4. **Fases y OCEAN (`#view-guide`):** visualización de los 5 rasgos OCEAN (`O: 85`, `C: 92`, `E: 72`, `A: 90`, `N: 10`) y tarjetas de activación por nivel.

---

## Cómo Ejecutarlo

### Sin Docker (Node.js estándar)
```bash
npm test
npm run dev
# Abre http://localhost:5500
```

### Con Docker Compose
```bash
docker compose up -d --build
# Abre http://localhost:5500
```

---

## Autoría

- **Autor:** Henrik Anderson Oloroso García (`Anderson-Oloroso`)
- **Licencia:** [MIT](./LICENSE)
