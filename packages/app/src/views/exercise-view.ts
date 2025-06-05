import { Auth, Observer } from "@calpoly/mustang";
import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface Exercise {
  cardName: string;
  icon: string;
  section: string;
  sets: number;
  reps: number;
  description: string;
  equipment: string;
  targets: string;
}

export class ExerciseView extends LitElement {
  /** The route will set `<exercise-view exercise-name="Bench%20Press">` */
  @property({ attribute: "exercise-name" })
  exerciseName?: string;

  /** Holds the fetched exercise data */
  @state()
  private exercise?: Exercise;

  /** Observe Auth to send JWT token if needed */
  private _authObserver = new Observer<Auth.Model>(this, "strength:auth");
  private _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    // 1) Wait for auth to resolve
    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this._user = user;
        // 2) If we have an exerciseName, fetch it
        if (this.exerciseName) {
          this.hydrate(this.exerciseName);
        }
      }
    });
  }

  updated(changed: Map<string, any>) {
    // If route param changed, re-fetch
    if (changed.has("exerciseName") && this.exerciseName &&
      this._user) {
      this.hydrate(this.exerciseName);
    }
  }

  private async hydrate(name: string) {
    const decoded = decodeURIComponent(name);
    const url = `/api/cards/exercise/${encodeURIComponent(decoded)}`;
    const headers = this._user ? Auth.headers(this._user) : {};
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
      this.exercise = (await res.json()) as Exercise;
    } catch (e) {
      console.error("Failed to load exercise:", e);
    }
  }

  render() {
    if (!this.exercise) {
      return html`<p>Loading…</p>`;
    }
    const { cardName, icon, sets, reps, description, equipment, targets } = this.exercise;
    return html`
      <main class="page">
        <header>
          <h1>
            <svg class="icon" viewBox="0 0 24 24">
              <use href="${icon}"></use>
            </svg>
            ${cardName}
          </h1>
        </header>
        <section>
          <p><strong>Sets:</strong> ${sets}</p>
          <p><strong>Reps:</strong> ${reps}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Equipment:</strong> ${equipment}</p>
          <p><strong>Targets:</strong> ${targets}</p>
          <p><a href="/app">← Back to Overview</a></p>
        </section>
      </main>
    `;
  }

  static styles = [
    css`
      :host {
        display: contents;
      }
      main.page {
        padding: var(--spacing-lg);
        font-family: var(--font-body);
      }
      header h1 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-family: var(--font-display);
        color: var(--color-accent);
        margin-bottom: var(--spacing-md);
      }
      section p {
        margin: var(--spacing-sm) 0;
        color: var(--color-text-primary);
      }
      h2 {
        font-family: var(--font-display);
        color: var(--color-accent);
        margin-top: var(--spacing-lg);
      }
      ul {
        list-style: none;
        padding: 0;
        margin: var(--spacing-sm) 0 var(--spacing-lg) 0;
      }
      ul li {
        margin-bottom: var(--spacing-xs);
      }
      ul li a {
        color: var(--color-text-primary);
        text-decoration: none;
        font-family: var(--font-body);
      }
      ul li a:hover {
        color: var(--color-accent);
      }
      svg.icon {
        display: inline-block;
        width: 2em;
        height: 2em;
        vertical-align: middle;
        fill: currentColor;      /* icon inherits text color */
        margin-right: 0.5em;     /* space before the label */
      }
      a {
        display: inline-flex;
        align-items: center;
        color: var(--color-primary);
        text-decoration: none;
        transition: color 0.3s ease, background-color 0.3s ease;
      }
      a:hover {
        color: var(--color-link-hover);
        background-color: var(--color-primary-light);
        border-radius: var(--radius-base);
      }
    `
  ];
}

customElements.define("exercise-view", ExerciseView);
