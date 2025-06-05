import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";
import { html } from "lit";

// Import the component classes
import { HeaderElement } from "./components/header.ts";
import { HomeViewElement } from "./views/home-view.js";
import { ExerciseView } from "./views/exercise-view.js";
import { NutritionView } from "./views/nutrition-view.js";
import { RecoveryView } from "./views/recovery-view.js";
import { EquipmentView } from "./views/equipment-view.js";
import { CardsListElement } from "./components/cards-list.js";
import { CardElement } from "./components/card.js";

const routes: Switch.Route[] = [
  {
    auth: "protected",
    path: "/app/exercise/:cardName",
    view: (params: Switch.Params) => html`
      <exercise-view exercise-name="${params.cardName}"></exercise-view>
    `
  },
  {
    auth: "protected",
    path: "/app/nutrition/:cardName",
    view: (params: Switch.Params) => html`
      <nutrition-view nutrition-name="${params.cardName}"></nutrition-view>
    `
  },
  {
    auth: "protected",
    path: "/app/recovery/:cardName",
    view: (params: Switch.Params) => html`
      <recovery-view recovery-name="${params.cardName}"></recovery-view>
    `
  },
  {
    auth: "protected",
    path: "/app/equipment/:cardName",
    view: (params: Switch.Params) => html`
      <equipment-view equipment-name="${params.cardName}"></equipment-view>
    `
  },
  {
    auth: "protected",
    path: "/app",
    view: () => html`<home-view></home-view>`
  },
  {
    path: "/",
    redirect: "/app"
  }
];



define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "strength:history", "strength:auth");
    }
  },
  "strength-header": HeaderElement,
  "home-view": HomeViewElement,
  "exercise-view": ExerciseView,
  "nutrition-view": NutritionView,
  "recovery-view": RecoveryView,
  "equipment-view": EquipmentView,
  "cards-list": CardsListElement,
  "card-element": CardElement,
});

HeaderElement.initializeOnce();