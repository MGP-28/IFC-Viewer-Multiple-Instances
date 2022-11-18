/**
 * Builds modal that occupies the screen, overlays any content and centers its own content
 * @returns modal element
 */
export function buildModal(){
    const modal = document.createElement('div')
    modal.classList.add("modal")
    return modal
}