export function degToRad(deg) {
    return deg * Math.PI / 180
}

export function randomRange(min, max) {
    const min_ = Math.min(min, max)
    const max_ = Math.max(min, max)
    return min_ + (max_ - min_) * Math.random()
}

export function distance2D(x1, y1, x2, y2) {
    const dx_ = x2 - x1
    const dy_ = y2 - y1
    return Math.sqrt(dx_ * dx_ + dy_ * dy_)
}