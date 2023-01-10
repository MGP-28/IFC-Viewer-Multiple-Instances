import { renderSidebarFeature } from "../../components/sidebar/sidebarFeature";
import { loadFeatureIntoSidebar, unloadFeatureFromSidebar } from "../../helpers/main-sidebar/mainSidebar";

export default class NavbarItem {
  #buildFunction;
  #loadFunction;
  #unloadFunction;

  /**
   *
   * @param {string} title Text to show in UI
   * @param {function} buildFunction handles feature creation
   * @param {function?} loadFunction optional - runs when feature loads to UI
   * @param {function?} unloadFunction optional - runs when feature unloads from UI
   */
  constructor(title, buildFunction, loadFunction = undefined, unloadFunction = undefined) {
    this.title = title;
    this.#buildFunction = buildFunction;
    this.#loadFunction = loadFunction;
    this.#unloadFunction = unloadFunction;
    this.subitems = [];
    this.component = undefined;
  }

  build() {
    // build main component
    const element = renderSidebarFeature(this);
    this.component = element;
    // build specifics
    this.#buildFunction(this.component);
  }

  load() {
    if (this.#loadFunction !== undefined) this.#loadFunction(this.component);
    // add to sidebar
    loadFeatureIntoSidebar(this);
  }

  unload() {
    if (this.#unloadFunction !== undefined) this.#unloadFunction(this.component);
    // remove from sidebar
    unloadFeatureFromSidebar(this);
  }
}
