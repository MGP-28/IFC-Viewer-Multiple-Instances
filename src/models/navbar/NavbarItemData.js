import { addContentToSidebarFeature, renderSidebarFeature } from "../../components/sidebar/sidebarFeature";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { loadFeatureIntoSidebar, unloadFeatureFromSidebar } from "../../helpers/main-sidebar/mainSidebar";

export default class NavbarItem {
  #buildFunction;
  #loadFunction;
  #unloadFunction;

  /**
   *
   * @param {string} title Text to show in UI
   * @param {function} buildFunction handles feature initialization. Should return html element, if sidebarPosition has a value
   * @param {string?} sidebarPosition optional - UI position for this feature. "l1", "l2", "r1", "r2". Default undefined
   * @param {function?} loadFunction optional - runs when feature loads to UI
   * @param {function?} unloadFunction optional - runs when feature unloads from UI
   */
  constructor(title, buildFunction, sidebarPosition = undefined, loadFunction = undefined, unloadFunction = undefined) {
    this.title = title;
    this.sidebarPosition = sidebarPosition
    this.#buildFunction = buildFunction;
    this.#loadFunction = loadFunction;
    this.#unloadFunction = unloadFunction;
    this.subitems = [];
    this.navbarItem = undefined;
    this.component = undefined;
    this.isExclusive = false;
    this.isRendered = false;
    this.isActive = false;
  }

  build() {
    if (this.sidebarPosition) {
      this.component = renderSidebarFeature(this);
      const content = this.#buildFunction(this);
      addContentToSidebarFeature(this.component, content);
    }
    else this.#buildFunction(this);

    this.isRendered = true;
  }

  load() {
    this.isActive = true;

    if (this.#loadFunction !== undefined) this.#loadFunction(this);

    emitEventOnElement(this.navbarItem, "loaded");

    // checks if feature is to be rendered in sidebar
    if (!this.sidebarPosition) return;

    // add to sidebar
    loadFeatureIntoSidebar(this);
  }

  unload() {
    this.isActive = false;

    if (this.#unloadFunction !== undefined) this.#unloadFunction(this);

    emitEventOnElement(this.navbarItem, "unloaded");

    // checks if feature is to be rendered in sidebar
    if (!this.sidebarPosition) return;

    // remove from sidebar
    unloadFeatureFromSidebar(this);
  }
}
