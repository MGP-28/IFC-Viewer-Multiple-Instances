import { addContentToSidebarFeature, renderSidebarFeature } from "../../components/sidebar/sidebarFeature";
import { renderSidebarTab } from "../../components/sidebar/tab";
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
   * @param {function} buildFunction handles feature creation. Should return html element, if isRenderedInSidebar is true
   * @param {function?} loadFunction optional - runs when feature loads to UI
   * @param {function?} unloadFunction optional - runs when feature unloads from UI
   */
  constructor(title, isRenderedInSidebar, buildFunction, loadFunction = undefined, unloadFunction = undefined) {
    this.title = title;
    this.isRenderedInSidebar = isRenderedInSidebar;
    this.#buildFunction = buildFunction;
    this.#loadFunction = loadFunction;
    this.#unloadFunction = unloadFunction;
    this.subitems = [];
    this.navbarItem = undefined;
    this.tabElement = undefined;
    this.component = undefined;
    this.isExclusive = false;
    this.isRendered = false;
    this.isActive = false;
    this.hasSidebarTab = false;
  }

  build() {
    // build main component
    if (this.isRenderedInSidebar) {
      const element = renderSidebarFeature(this);
      this.component = element;
    }
    // build specifics
    let content = undefined;
    if (this.#buildFunction) content = this.#buildFunction(this);
    console.log("content", content)

    if (this.isRenderedInSidebar) addContentToSidebarFeature(this.component, content);

    this.isRendered = true;
  }

  load() {
    this.isActive = true;

    if (this.#loadFunction !== undefined) this.#loadFunction(this);

    emitEventOnElement(this.navbarItem, "loaded");
    if(this.hasSidebarTab) emitEventOnElement(this.tabElement, "loaded");

    // checks if feature is to be rendered in sidebar
    if (!this.isRenderedInSidebar) return;

    // add to sidebar
    loadFeatureIntoSidebar(this);
  }

  unload() {
    this.isActive = false;

    if (this.#unloadFunction !== undefined) this.#unloadFunction(this);

    emitEventOnElement(this.navbarItem, "unloaded");
    if(this.hasSidebarTab) emitEventOnElement(this.tabElement, "unloaded");

    // checks if feature is to be rendered in sidebar
    if (!this.isRenderedInSidebar) return;

    // remove from sidebar
    unloadFeatureFromSidebar(this);
  }

  renderSidebarTab(){

  }
}
