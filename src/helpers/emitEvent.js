function emitGlobalEvent(eventName){
    const event = new Event(eventName)
    document.dispatchEvent(event)
}

function emitCustomGlobalEvent(eventName, detail){
    const customEvent = new CustomEvent(eventName, {
        detail: detail
      });
    document.dispatchEvent(customEvent)
}

function emitEventOnElement(element, eventName) {
    const event = new Event(eventName)
    element.dispatchEvent(event)
}

export { emitGlobalEvent, emitCustomGlobalEvent, emitEventOnElement }