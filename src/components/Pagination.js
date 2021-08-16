import Eventbus from '../../eventbus.js';

export class Pagination {
  constructor(length, currentPage = 0) {
    this.maxPages = length - 1;
    this.currentPage = currentPage;
  }

  setPage(index) {
    if (index > this.maxPages + 1 || index < 0) {
      return;
    }

    this.currentPage = index;
    Eventbus.emit('pageChange', index);
  }

  changePage(direction) {
    this.setPage(this.currentPage + direction);
  }

  prevPage() {
    this.changePage(-1);
  }

  nextPage() {
    this.changePage(1);
  }

  addMaxPage(pages = 1) {
    this.maxPages += pages;
  }
}
