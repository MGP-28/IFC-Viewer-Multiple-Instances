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

export { emitGlobalEvent, emitCustomGlobalEvent }