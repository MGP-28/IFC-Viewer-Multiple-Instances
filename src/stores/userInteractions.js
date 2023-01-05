const userInteractions = {
    controlActive: false,
    shiftActive: false,
    keyCActive: false,
    clippingPlanes: false,
    draggingPlane: false,
    animationRunning: false,
    savedViews: false,
    annotations: false,
}

const isUserPressingSpecialKeys = () => {
    return userInteractions.controlActive || userInteractions.shiftActive || userInteractions.keyCActive
}

export { userInteractions, isUserPressingSpecialKeys }