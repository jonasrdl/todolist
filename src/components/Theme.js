export class Theme {
    constructor() {}

    get() {
        return localStorage.getItem('theme');
    }

    set(data) {
        localStorage.setItem('theme', data)
    }
}