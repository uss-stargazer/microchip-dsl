export function nullSignal() {
    return { component: null, pin: null };
}
export function copySignal(from, to) {
    to.component = from.component;
    to.pin = from.pin;
}
//# sourceMappingURL=signal.js.map