/**
 * Multiplier - Speed multiplier when dragging a plane
 * 
 * MaxJump - Absolute maximum distance, in units, that a mouse drag tick can move a plane
 * (prevents sudden fast movements)
 * 
 * Buffer - Distance, in units, that a plane leaves when it reaches the other plane in the same axle
 */
const clippingConfigs = {
    multiplier: {
        normal: 1,
        precision: 0.05,
        fast: 5
    },
    maxJump: 2,
    buffer: 0.05
}

export { clippingConfigs }