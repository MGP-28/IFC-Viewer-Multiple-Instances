export default class NavbarItem{
    constructor(title, buildFunction, loadFunction = undefined, unloadFunction = undefined){
        this.title = title;
        this.#buildFunction = buildFunction;
        this.#loadFunction = loadFunction;
        this.#unloadFunction = unloadFunction;
        this.subitems = [];
        this.component = undefined;
    }
    build(){
        const element = this.#buildFunction();
        this.component = element;
    }
    load(){
        if(this.#loadFunction !== undefined) this.#loadFunction(this.component);
        // add to sidebar
    }
    unload(){
        if(this.#unloadFunction !== undefined) this.#unloadFunction(this.component);
        // remove from sidebar
    }
}