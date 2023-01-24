const userInteractions = {
    controlActive: false,
    shiftActive: false,
    keyCActive: false,
    keyXActive: false,
    clippingPlanes: false,
    draggingPlane: false,
    animationRunning: false,
    savedViews: false,
    annotations: false,
}

const isUserPressingSpecialKeys = () => {
    return userInteractions.controlActive || userInteractions.shiftActive
}

const disableFeatureKeys = () => {
    userInteractions.keyXActive = false;
}

export { userInteractions, isUserPressingSpecialKeys, disableFeatureKeys }