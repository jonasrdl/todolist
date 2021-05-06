class Storage {
  constructor(key) {
    this.key = key; // Localstorage key
  }

  setData(data) {
    localStorage.setItem(this.key, JSON.stringify(data)); //
  }

  getData() {
    localStorage.getItem(this.key);
  }

  clearData() {
    localStorage.removeItem(this.key);
  }
}

export default Storage;
