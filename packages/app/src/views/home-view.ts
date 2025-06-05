import { LitElement, html, css } from "lit";
import reset from "../styles/reset.css";

export class HomeViewElement extends LitElement {
  static styles = [
    reset.styles,
    css`
    body {
  background-color: var(--color-background-page);
  color: var(--color-text-primary);
  font-family: var(--font-family-body);
  font-weight: 400;
  line-height: var(--line-height-base);
  margin: 0;
  padding: 0;
}

*, *::before, *::after {
  box-sizing: border-box;
}
  
/* Header Styling */
header {
  background-color: var(--color-background-header);
  color: var(--color-text-header);
  padding: var(--spacing-md) var(--spacing-sm);
  box-shadow: var(--shadow-header);
  border-bottom: 3px solid var(--color-primary);
}

/* Layout for header */
.site-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
/* Branding (logo + name) */
.branding {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}
.branding .logo {
    width: 2.5rem;
    height: auto;
}
.branding .app-name {
    font-size: 1.25rem;
    font-weight: 700;
    font-family: var(--font-family-heading);
}

/* Center title (will shrink if necessary) */
.page-title {
    flex: 0 0 auto;
    text-align: left;
    margin: 0 0 var(--spacing-sm) 0; /* add bottom spacing */
    font-size: 1.5rem;
}

/* Navigation */
.header-nav ul {
    display: flex;
    gap: var(--spacing-sm);
    list-style: none;
    margin: 0;
    padding: 0;
}
.header-nav a {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-base);
    transition: background-color 0.2s;
}
.header-nav a:hover {
    background-color: var(--color-primary-light);
}

/* User info -> add later*/
/* .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}
.user-info .avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
} */

/* List Styles */
ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-gap);
  margin: var(--spacing-sm) 0;
  padding: 0;
}
li {
  background-color: var(--color-background-card);
  padding: var(--spacing-sm);
  border-radius: var(--radius-base);
  transition: transform 0.2s ease, background-color 0.2s ease;
}
li:hover {
  background-color: var(--color-background-card-hover);
  transform: translateY(-2px);
}

/* Accent Colors for Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease, background-color 0.3s ease;
}
a:hover {
  color: var(--color-link-hover);
  background-color: var(--color-primary-light);
  border-radius: var(--radius-base);
}
  
/* Heading Accent */
h1, h2, h3 {
  color: var(--color-primary);
  margin: var(--spacing-sm) 0 var(--spacing-xs);
  font-family: var(--font-family-heading);
  font-weight: 500;
  line-height: var(--line-height-base); /* added line-height for headings */
}

/* Button Styling */
button, a.button {
  color: var(--color-button-text);
  background-color: var(--color-button-bg) !important;
  border: none;
  border-radius: var(--radius-base);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: var(--font-family-heading);
  font-weight: 700;
}
button:hover, a.button:hover {
  background-color: var(--color-button-hover-bg);
}

svg.icon {
    display: inline-block;
    width: 2em;
    height: 2em;
    vertical-align: middle;
    fill: currentColor;      /* makes icon inherit text color */
    margin-right: 0.5em;     /* a little space before the label */
  }

/* Page Grid: 12-column base */
.page-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--spacing-lg);
  align-items: start;
}

/* Sidebar spans 3 columns */
.sidebar {
  grid-column: 1 / span 3;
  margin-left: var(--spacing-sm);
}

/* Main content spans remaining 9 columns */
.content {
  grid-column: 4 / span 9;
  display: flow-root;
  padding: var(--spacing-sm);
}

/* Tablet breakpoint: switch to 8-column grid */
@media (max-width: 1024px) {
  .page-grid {
    grid-template-columns: repeat(8, 1fr);
  }
  .sidebar {
    grid-column: 1 / span 2;
  }
  .content {
    grid-column: 3 / span 6;
  }
}

/* Mobile breakpoint: single-column layout */
@media (max-width: 600px) {
  .page-grid {
    grid-template-columns: 1fr;
  }
  .sidebar {
    grid-column: auto;
    margin-left: 0;
  }
  .content {
    grid-column: auto;
  }
}`
  ];

  render() {
    return html`
      <div class="page-grid">
        <main class="content">
          <section>
            <h2>Workout Details</h2>
            <p><strong>Date:</strong> 2025-04-10</p>
            <p><strong>Duration:</strong> 60 minutes</p>
            <p>
              <strong>Description:</strong> An intensive workout covering strength,
              cardio, and flexibility exercises.
            </p>
          </section>

          <cards-list src="/api/cards"></cards-list>

          <section>
            <h2>Targeted Muscle Groups</h2>
            <ul>
              <li><a href="/app/musclegroup/chest">Chest</a></li>
              <li><a href="/app/musclegroup/legs">Legs</a></li>
            </ul>
          </section>
        </main>
      </div>
    `;
  }
}

customElements.define("home-view", HomeViewElement);