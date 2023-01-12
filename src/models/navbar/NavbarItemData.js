import { addContentToSidebarFeature, renderSidebarFeature } from "../../components/features/sidebar/sidebarFeature";
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
   * @param {function?} loadFunction optional - runs when feature loads to UI
   * @param {function?} unloadFunction optional - runs when feature unloads from UI
   * @param {string?} sidebarPosition optional - UI position for this feature. "l1", "l2", "r1", "r2". Default undefined
   */
  constructor(title, buildFunction, loadFunction = undefined, unloadFunction = undefined) {
    this.title = title;
    this.#buildFunction = buildFunction;
    this.#loadFunction = loadFunction;
    this.#unloadFunction = unloadFunction;
    this.isRendered = false;
    this.isActive = false;
    this.navbarItem = undefined;
    this.subitems = [];
    this.component = undefined;
    this.sidebarPosition = undefined;
    this.isExclusive = false;
  }

  async build() {
    if (this.sidebarPosition) {
      this.component = renderSidebarFeature(this);
      const content = await this.#buildFunction(this);
      addContentToSidebarFeature(this.component, content);
    }
    else this.#buildFunction(this);

    this.isRendered = true;
  }

  async load() {
    this.isActive = true;

    if (this.#loadFunction !== undefined) await this.#loadFunction(this);

    emitEventOnElement(this.navbarItem, "loaded");

    // checks if feature is to be rendered in sidebar
    if (!this.sidebarPosition) return;

    // add to sidebar
    loadFeatureIntoSidebar(this);
  }

  async unload() {
    this.isActive = false;

    if (this.#unloadFunction !== undefined) await this.#unloadFunction(this);

    emitEventOnElement(this.navbarItem, "unloaded");

    // checks if feature is to be rendered in sidebar
    if (!this.sidebarPosition) return;

    // remove from sidebar
    unloadFeatureFromSidebar(this);
  }
}
