import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import reset from "../styles/reset.css";
import {
  Auth, Observer,
} from "@calpoly/mustang";

interface CardItem {
  cardName: string;
  icon: string;
  section: string;
}

export class CardsListElement extends LitElement {

    _authObserver = new Observer<Auth.Model>(this, "strength:auth");
    _user?: Auth.User;

    override connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      if (this.src) this.hydrate(this.src);
    });
  }

  get authorization(): { Authorization?: string } {
    if (this._user && this._user.authenticated)
      return {
        Authorization:
          `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      };
    else return {};
  }
  
  /** URL of the JSON data file */
  @property({ type: String }) src = '';

    protected updated(changed: Map<string, any>) {
        if (changed.has('src') && this.src && this._user?.authenticated) {
            this.hydrate(this.src);
        }
    }

  /** Parsed sections from the JSON */
  @state() exercises: CardItem[] = [];
  @state() nutrition: CardItem[] = [];
    @state() recovery: CardItem[] = [];
  @state() equipment: CardItem[] = [];

  /** Load the JSON and split into the four state arrays, using each item's `section` */
  private async hydrate(src: string) {
    try {
      const res = await fetch(src, {
        headers: this.authorization
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} fetching ${src}`);
      }
      // Expecting a flat array of cards, each with a "section" field
      const all = (await res.json()) as Array<CardItem & { section: string }>;

      // Partition by section
      this.exercises = all.filter(item => item.section === "exercise");
      this.nutrition  = all.filter(item => item.section === "nutrition");
      this.recovery   = all.filter(item => item.section === "recovery");
      this.equipment  = all.filter(item => item.section === "equipment");
    } catch (e) {
      console.error(`Failed to fetch cards data from ${src}:`, e);
    }
  }

  /** Render each section by mapping its array to <exercise-card> instances */
  override render() {
    return html`
      <section>
        <h2>
          <svg class="icon"><use href="/icons/gym.svg#icon-dumbbell"></use></svg>
          Exercises
        </h2>
        <ul>
          ${this.exercises.map(item => html`
            <card-element
              card-name="${item.cardName}"
              icon="${item.icon}"
              section="exercise"
            ></card-element>
          `)}
        </ul>
      </section>

      <section>
        <h2>
          <svg class="icon"><use href="/icons/gym.svg#icon-nutrition"></use></svg>
          Fueled by Nutrition
        </h2>
        <ul>
          ${this.nutrition.map(item => html`
            <card-element
              card-name="${item.cardName}"
              icon="${item.icon}"
              section="nutrition"
            ></card-element>
          `)}
        </ul>
      </section>

      <section>
        <h2>
          <svg class="icon"><use href="/icons/gym.svg#icon-recovery"></use></svg>
          Followed by Recovery
        </h2>
        <ul>
          ${this.recovery.map(item => html`
            <card-element
              card-name="${item.cardName}"
              icon="${item.icon}"
              section="recovery"
            ></card-element>
          `)}
        </ul>
      </section>

      <section>
        <h2>
          Equipment Used
        </h2>
        <ul>
          ${this.equipment.map(item => html`
            <card-element
              card-name="${item.cardName}"
              icon="${item.icon}"
              section="equipment"
            ></card-element>
          `)}
        </ul>
      </section>
    `;
  }

  static styles = [
      reset.styles,
      css`
      /* Global Page Styles */
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
}`];

}