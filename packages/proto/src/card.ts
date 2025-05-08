import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.ts";

export class ExerciseElement extends LitElement {
    @property({type: String, attribute: "exercise-href"}) href = "";
    @property({type: String}) icon = "";
    @property({type: String}) name = "";
  
  override render() {
    return html`
        <li>
            <a href="${this.href}">
            <svg class="icon" viewBox="0 0 24 24">
                <use href="${this.icon}"></use>
            </svg>
            <slot name="name">${this.name}</slot>
            </a>
        </li>
    `;
  }

  static styles = [
    reset.styles,
    css`
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
    svg.icon {
        display: inline-block;
        width: 2em;
        height: 2em;
        vertical-align: middle;
        fill: currentColor;      /* makes icon inherit text color */
        margin-right: 0.5em;     /* a little space before the label */
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
    }`];
}