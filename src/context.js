export class WindowScrollContext {
  constructor(window) {
    this.window = window;
    this.scrollZone = window.document.body;
  }

  get scrollY() {
    return this.window.scrollY;
  }

  get height() {
    return this.window.innerHeight;
  }

  get contentHeight() {
    return this.scrollZone.getBoundingClientRect().height;
  }

  get scrollPercent() {
    const max = this.contentHeight - this.height;
    return this.scrollY / max * 100;
  }

  elementTop(element) {
    return element.getBoundingClientRect().top + this.scrollY;
  }

  onResize(callback) {
    window.addEventListener("resize", callback);
  }

  onScroll(callback) {
    window.addEventListener("scroll", callback);
  }
}
