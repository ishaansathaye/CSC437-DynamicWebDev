import {
  define,
  Auth,
  Dropdown,
  Events,
  Observer
} from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";
import { state } from "lit/decorators.js";

function toggleLightMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;

  Events.relay(ev, "light-mode", { checked });
}

export class HeaderElement extends LitElement {
  static uses = define({
    "mu-dropdown": Dropdown.Element
  });

  @state()
  loggedIn = false;

  @state()
  userid?: string;

  render() {
    return html`
      <header>
        <h1>GymTracker</h1>
        <nav>
          <mu-dropdown>
            <a slot="actuator">
              Welcome back, ${this.userid || "traveler"}
            </a>
            <menu>
              <li>
              <label @change=${toggleLightMode}>
                <input type="checkbox" />
                Light Mode
              </label>
            </li>
              <li>
                ${this.loggedIn
                  ? this.renderSignOutButton()
                  : this.renderSignInButton()
                }
              </li>
            </menu>
          </mu-dropdown>
        </nav>
      </header>`;
  }

  static styles = [
    reset.styles,
    css`
    :host { display: contents; }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-lg);
      background-color: var(--color-primary);
      color: var(--color-text-header);
      font-family: 'Oswald', sans-serif;
      box-shadow: var(--shadow-header);
    }

    header h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 500;
      font-family: 'Oswald', sans-serif;
      color: var(--color-text-header);
    }

    nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      font-family: 'Roboto', sans-serif;
    }

    nav p {
      margin: 0;
      font-size: 1rem;
      color: var(--color-text-primary);
    }

    mu-dropdown a[slot="actuator"] {
      color: var(--color-text-header);
      text-decoration: none;
      font-size: 1rem;
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
    }
    mu-dropdown a[slot="actuator"]:hover {
      color: var(--color-accent);
    }

    /* Sign in/out button styling */
    button {
      background-color: var(--color-accent);
      color: var(--color-text-header);
      border: none;
      border-radius: var(--radius-base);
      padding: var(--spacing-xs) var(--spacing-sm);
      font-family: var(--font-body);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    button:hover {
      background-color: var(--color-accent-light);
    }
  `,
];

  renderSignOutButton() {
    return html`
      <button
        @click=${(e: UIEvent) => {
          Events.relay(e, "auth:message", ["auth/signout"])
        }}
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html`
      <a @click=${() => location.assign("/login.html")}>Sign In</a>
    `;
  }

  _authObserver = new Observer<Auth.Model>(this, "strength:auth");

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;

      if (user && user.authenticated ) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }


  static initializeOnce() {
    function toggleLightMode(
      page: HTMLElement,
      checked: boolean
    ) {
      page.classList.toggle("light-mode", checked);
    }

    document.body.addEventListener("light-mode", (event) =>
      toggleLightMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail?.checked
      )
    );
  }

}