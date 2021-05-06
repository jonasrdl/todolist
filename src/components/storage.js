export class todoStorage {
  constructor(key) {
    this.key = key;
  }

  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get() {
    localStorage.getItem(this.key);
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

export class themeStorage {
  constructor(key) {
    this.key = key;
  }

  set(data) {
    localStorage.setItem(this.key, data);
  }

  get() {
    localStorage.getItem(this.key);
  }
}
