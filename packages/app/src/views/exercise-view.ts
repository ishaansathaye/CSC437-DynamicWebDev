// app/src/views/exercise-view.ts
import { View, Form, define } from "@calpoly/mustang";
import reset from "../styles/reset.css";
import { html, css, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Card } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class ExerciseView extends View<Model, Msg> {
  static uses = define({ "mu-form": Form.Element });

  constructor() {
    super("strength:model");
  }

  /** The router will set `<exercise-view exercise-name="Bench%20Press">`. */
  @property({ attribute: "exercise-name" })
  exerciseName?: string;

  /** Expose `model.selectedCard` as a reactive state */
  @state()
  private get exercise(): Card | undefined {
    return this.model.selectedCard;
  }

  static override styles = [
    reset.styles,
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
      svg.icon {
        display: inline-block;
        width: 2em;
        height: 2em;
        vertical-align: middle;
        fill: currentColor;
        margin-right: 0.5em;
      }
      a.back-link {
        display: inline-flex;
        align-items: center;
        margin-top: var(--spacing-lg);
        color: var(--color-primary);
        text-decoration: none;
        font-family: var(--font-body);
        transition: color 0.3s ease, background-color 0.3s ease;
      }
      a.back-link:hover {
        color: var(--color-link-hover);
        background-color: var(--color-primary-light);
        border-radius: var(--radius-base);
      }
    `
  ];

  override render(): TemplateResult {
    if (!this.exercise) {
      return html`<p>Loading…</p>`;
    }

    // Destructure only what is guaranteed on `Card`
    const { cardName, icon, description } = this.exercise;

    // Now pull the extra fields via a safe cast to any
    const extra = this.exercise as any;
    const sets: number | undefined       = extra.sets;
    const reps: number | undefined       = extra.reps;
    const equipment: string | undefined  = extra.equipment;
    const targets: string | undefined    = extra.targets;

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
          <mu-form
            .initial=${{ sets, reps }}
            @mu-form:submit=${this.handleFormSubmit}
          >
            ${sets !== undefined
              ? html`<p><strong>Sets:</strong> <input name="sets" type="number" .value=${sets}></p>`
              : null}
            ${reps !== undefined
              ? html`<p><strong>Reps:</strong> <input name="reps" type="number" .value=${reps}></p>`
              : null}
          </mu-form>
          <p><strong>Description:</strong> ${description}</p>
          ${equipment !== undefined
            ? html`<p><strong>Equipment:</strong> ${equipment}</p>`
            : null}
          ${targets !== undefined
            ? html`<p><strong>Targets:</strong> ${targets}</p>`
            : null}
          <a class="back-link" @click=${() => location.assign("/app")}>
            ← Back to Overview
          </a>
        </section>
      </main>
    `;
  }

 handleFormSubmit(event: CustomEvent) {
  const detail = event.detail;
  const sets = detail.sets !== undefined ? Number(detail.sets) : undefined;
  const reps = detail.reps !== undefined ? Number(detail.reps) : undefined;

  if (!this.exercise) return;

  // Build a payload that sends only set/reps if defined:
  const payload: any = {
    section: "exercise",
    cardName: this.exercise.cardName
  };
  if (sets !== undefined) payload.sets = sets;
  if (reps !== undefined) payload.reps = reps;

  this.dispatchMessage([
    "card/update",
    payload
  ]);
}

  /** When `exercise-name` changes, ask the store to load that card. */
  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
  super.attributeChangedCallback(name, oldVal, newVal);
  if (name === "exercise-name") {
    console.log(`[exercise-view] attributeChangedCallback: exercise-name="${newVal}"`);
    if (newVal) {
      const decodedName = decodeURIComponent(newVal);
      this.dispatchMessage([
        "card/select",
        { section: "exercise", cardName: decodedName }
      ]);
    }
  }
}
}
customElements.define("exercise-view", ExerciseView);