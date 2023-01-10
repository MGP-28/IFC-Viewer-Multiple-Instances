import { renderSidebarFeature } from "../../components/sidebar/sidebarFeature";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { loadFeatureIntoSidebar, unloadFeatureFromSidebar } from "../../helpers/main-sidebar/mainSidebar";

export default class NavbarItem {
  #buildFunction;
  #loadFunction;
  #unloadFunction;

  /**
   *
   * @param {string} title Text to show in UI
   * @param {boolean} isRenderedInSidebar Will the feature have an UI component
   * @param {function} buildFunction handles feature creation
   * @param {function?} loadFunction optional - runs when feature loads to UI
   * @param {function?} unloadFunction optional - runs when feature unloads from UI
   * @param {boolean?} isExculsive default false - defines if a navbar subitem is exclusively selected
   */
  constructor(
    title,
    isRenderedInSidebar,
    buildFunction,
    loadFunction = undefined,
    unloadFunction = undefined,
    isExculsive = false
  ) {
    this.title = title;
    this.isRenderedInSidebar = isRenderedInSidebar;
    this.#buildFunction = buildFunction;
    this.#loadFunction = loadFunction;
    this.#unloadFunction = unloadFunction;
    this.subitems = [];
    this.navbarItem = undefined;
    this.component = undefined;
    this.isExclusive = isExculsive;
    this.isRendered = false;
    this.isActive = false;
  }

  build() {
    // build main component
    if (this.isRenderedInSidebar) {
      const element = renderSidebarFeature(this);
      this.component = element;
    }
    // build specifics
    this.#buildFunction(this);

    this.isRendered = true;
  }

  load() {
    this.isActive = true;

    if (this.#loadFunction !== undefined) this.#loadFunction(this);

    emitEventOnElement(this.navbarItem, "loaded");

    // checks if feature is to be rendered in sidebar
    if (!this.isRenderedInSidebar) return;

    // add to sidebar
    loadFeatureIntoSidebar(this);
  }

  unload() {
    this.isActive = false;

    if (this.#unloadFunction !== undefined) this.#unloadFunction(this);

    emitEventOnElement(this.navbarItem, "unloaded");

    // checks if feature is to be rendered in sidebar
    if (!this.isRenderedInSidebar) return;

    // remove from sidebar
    unloadFeatureFromSidebar(this);
  }
}
