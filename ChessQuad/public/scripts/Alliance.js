const Alliance = {
  WHITE: {
    direction: -1,
    get next () {
      return this.parent.BLACK;
    }
  },
  BLACK: {
    direction: 1,
    get next () {
      return this.parent.WHITE;
    }
  },
  _init_: function () {
    this.BLACK.parent = this;
    this.WHITE.parent = this;
    delete this._init_;
    return this;
  }
}._init_();

export default Alliance;