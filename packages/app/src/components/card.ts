// packages/app/src/components/card.ts

import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "../styles/reset.css.ts"; // adjust path if needed

export class CardElement extends LitElement {
  // The display name of the card (e.g. "Bench Press")
  @property({ type: String, attribute: "card-name" })
  cardName = "";

  // The SVG‐sprite reference (e.g. "/icons/gym.svg#icon-bench-press")
  @property({ type: String })
  icon = "";

  // One of "exercise" | "nutrition" | "recovery" | "equipment"
  @property({ type: String })
  section = "";

  // Compute the URL based on section + cardName
  get href(): string {
    // e.g. "/app/exercise/Bench%20Press"
    return `/app/${this.section}/${encodeURIComponent(this.cardName)}`;
  }

  override render() {
    return html`
      <li>
        <a href="${this.href}">
          <svg class="icon" viewBox="0 0 24 24">
            <use href="${this.icon}"></use>
          </svg>
          <span>${this.cardName}</span>
        </a>
      </li>
    `;
  }

  static styles = [
    reset.styles,
    css`
      li {
        list-style: none;
        background-color: var(--color-background-card);
        padding: var(--spacing-sm);
        border-radius: var(--radius-base);
        transition: transform 0.2s ease, background-color 0.2s ease;
      }
      li:hover {
        background-color: var(--color-background-card-hover);
        transform: translateY(-2px);
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
      span {
        font-family: var(--font-body);
        font-weight: 500;
      }
    `
  ];
}

customElements.define("card-element", CardElement);