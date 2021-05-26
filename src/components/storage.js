export class Storage {
  constructor(key) {
    this.key = key;
  }

  set(data) {
    localStorage.setItem(this.key, data);
  }

  get() {
    return localStorage.getItem(this.key);
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
