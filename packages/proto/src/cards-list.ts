import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import reset from './styles/reset.js';

interface CardItem {
  name: string;
  icon: string;
  href: string;
}

interface CardsData {
  exercises: CardItem[];
  nutrition: CardItem[];
  recovery: CardItem[];
  equipment: CardItem[];
}

export class CardsListElement extends LitElement {
  /** URL of the JSON data file */
  @property({ type: String }) src = '';

  /** Parsed sections from the JSON */
  @state() exercises: CardItem[] = [];
  @state() nutrition: CardItem[] = [];
    @state() recovery: CardItem[] = [];
  @state() equipment: CardItem[] = [];

  /** Fetch and hydrate as soon as the element is connected */
  override connectedCallback() {
    super.connectedCallback();
    if (this.src) {
      this.hydrate(this.src);
    }
  }

  /** Load the JSON and split into the three state arrays */
  private async hydrate(src: string) {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CardsData;
      this.exercises = data.exercises;
      this.nutrition = data.nutrition;
        this.recovery = data.recovery;
      this.equipment = data.equipment;
    } catch (e) {
      console.error('Failed to fetch cards data:', e);
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
            <card-element preview
              name="${item.name}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.name}</span>
            </card-element>
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
            <card-element preview
              name="${item.name}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.name}</span>
            </card-element>
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
            <card-element preview
              name="${item.name}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.name}</span>
            </card-element>
          `)}
        </ul>
      </section>

      <section>
        <h2>
          Equipment Used
        </h2>
        <ul>
          ${this.equipment.map(item => html`
            <card-element preview
              name="${item.name}"
              icon="${item.icon}"
              exercise-href="${item.href}">
              <span slot="name">${item.name}</span>
            </card-element>
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