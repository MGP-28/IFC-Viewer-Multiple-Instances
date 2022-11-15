export default function emitGlobalEvent(eventName){
    const event = new Event(eventName)
    document.dispatchEvent(event)
}