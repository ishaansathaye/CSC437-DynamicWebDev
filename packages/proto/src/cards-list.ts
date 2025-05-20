import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import reset from './styles/reset.js';
import {
  Auth, Observer,
} from "@calpoly/mustang";

interface CardItem {
  cardName: string;
  icon: string;
  href: string;
}

// interface CardsData {
//   exercises: CardItem[];
//   nutrition: CardItem[];
//   recovery: CardItem[];
//   equipment: CardItem[];
// }

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
            <exercise-card preview
              name="${item.cardName}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.cardName}</span>
            </exercise-card>
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
            <exercise-card preview
              name="${item.cardName}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.cardName}</span>
            </exercise-card>
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
            <exercise-card preview
              name="${item.cardName}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.cardName}</span>
            </exercise-card>
          `)}
        </ul>
      </section>

      <section>
        <h2>
          Equipment Used
        </h2>
        <ul>
          ${this.equipment.map(item => html`
            <exercise-card preview
              name="${item.cardName}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.cardName}</span>
            </exercise-card>
          `)}
        </ul>
      </section>
    `;
  }

  static styles = [
      reset.styles,
      css`
      h1, h2, h3 {
  color: var(--color-primary);
  margin: var(--spacing-sm) 0 var(--spacing-xs);
  font-family: var(--font-family-heading);
  font-weight: 500;
  line-height: var(--line-height-base); /* added line-height for headings */
}
  ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-gap);
  margin: var(--spacing-sm) 0;
  padding: 0;
}
  svg.icon {
    display: inline-block;
    width: 2em;
    height: 2em;
    vertical-align: middle;
    fill: currentColor;      /* makes icon inherit text color */
    margin-right: 0.5em;     /* a little space before the label */
  }`];
}