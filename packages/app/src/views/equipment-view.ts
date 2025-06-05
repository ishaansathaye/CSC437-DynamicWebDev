import { Auth, Observer } from "@calpoly/mustang";
import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface Equipment {
  cardName: string;
  icon: string;
  section: string;
  description: string;
}

export class EquipmentView extends LitElement {
  /** The route will set `<equipment-view equipment-name="Bench%20and%20Weights">` */
  @property({ attribute: "equipment-name" })
  equipmentName?: string;

  /** Holds the fetched equipment object */
  @state()
  private equipment?: Equipment;

  /** Observe Auth so we can send the user’s token if needed */
  private _authObserver = new Observer<Auth.Model>(this, "strength:auth");
  private _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    // 1) Wait for auth to resolve
    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this._user = user;
        // 2) If we have an equipmentName, fetch it
        if (this.equipmentName) {
          this.hydrate(this.equipmentName);
        }
      }
    });
  }

  updated(changed: Map<string, any>) {
    // If the route changed `equipmentName`, re‐fetch
    if (
      changed.has("equipmentName") &&
      this.equipmentName &&
      this._user // only fetch once we have a valid user object
    ) {
      this.hydrate(this.equipmentName);
    }
  }

  private async hydrate(name: string) {
    const decoded = decodeURIComponent(name);
    const url = `/api/cards/equipment/${encodeURIComponent(decoded)}`;
    const headers = this._user ? Auth.headers(this._user) : {};
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
      this.equipment = (await res.json()) as Equipment;
    } catch (e) {
      console.error("Failed to load equipment:", e);
    }
  }

  render() {
    if (!this.equipment) {
      return html`<p>Loading…</p>`;
    }
    const { cardName, icon, description } = this.equipment;
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
          <p><strong>Description:</strong> ${description}</p>
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

customElements.define("equipment-view", EquipmentView);