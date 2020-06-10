// limit definition: lim h->0
// me:               h = 0.0001

export function ddx(f: Function, x: number, h = 0.0001) {
    return (f(x + h) - f(x)) / h;
}
