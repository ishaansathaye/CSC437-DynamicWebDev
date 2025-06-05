import { Auth, Observer } from "@calpoly/mustang";
import { LitElement, html, css } from "lit";
import { state, property } from "lit/decorators.js";

interface CardItem {
  cardName: string;
  icon: string;
  section: string;
  duration: string;
  description: string;
}

export class RecoveryView extends LitElement {
  /** The route sets <recovery-view recovery-name="Cool%20Down%20%26%20Stretching"> */
  @property({ attribute: "recovery-name" })
  recoveryName?: string;

  @state()
  private item?: CardItem;

  private _authObserver = new Observer<Auth.Model>(this, "strength:auth");
  private _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this._user = user;
        // If we have a recoveryName, fetch it
        if (this.recoveryName) {
          this.hydrate(this.recoveryName);
        }
      }
    });
  }

  private async hydrate(encodedName: string) {
    const decoded = decodeURIComponent(encodedName);
    const url = `/api/cards/recovery/${encodeURIComponent(decoded)}`;
    const headers = this._user ? Auth.headers(this._user) : {};
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
      this.item = (await res.json()) as CardItem;
    } catch (e) {
      console.error("Failed to load recovery detail:", e);
    }
  }

  render() {
    if (!this.item) {
      return html`<p>Loading recovery detail…</p>`;
    }
    const { cardName, icon, duration, description } = this.item;
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
          <p><strong>Duration:</strong> ${duration}</p>
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
      .back-link {
        color: var(--color-accent);
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
      }
      .back-link:hover {
        text-decoration: underline;
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

customElements.define("recovery-view", RecoveryView);