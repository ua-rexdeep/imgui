export function computeSize(size) {
    if(size == null) return null;
    if(typeof(size) == "number") return size + '%';
    else return size;
}

export function coloredString(value) {
    return value.replaceAll(/%(\w+)%([^%]+)/g, (_, color, text) => `<span style="color: ${color};">${text}</span>`)
}