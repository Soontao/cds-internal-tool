/**
 * LRU (Least Recently Used) Map implementation
 */
export class LRUMap<K = any, V = any> extends Map<K, V> {

  /**
   * the max number of total items
   */
  private _maxSize = 1024;

  /**
   * LRU (Least Recently Used) Map implementation
   *
   * will remove the oldest item when reach the size limit
   *
   * @param maxSize maximum cache item number, default is 1024
   * @example
   *
   * ```ts
   * const m = new LRUMap(1)
   * m.set('a','v') // {'a':'v'}
   * m.set('b','c') // {'b':'c'}
   * ```
   */
  constructor(maxSize?: number) {
    super();
    if (typeof maxSize === "number" && maxSize > 0) {
      this._maxSize = maxSize;
    }
  }

  public get(key: K) {
    if (super.has(key)) {
      const item = super.get(key) as V;
      // refresh key
      super.delete(key);
      super.set(key, item);
    }

    return super.get(key);
  }

  public set(key: K, val: V): this {
    // refresh key
    if (super.has(key)) { super.delete(key); }
    // evict oldest
    else if (this.size >= this._maxSize) { super.delete(this.first()); }
    super.set(key, val);
    return this;
  }

  private first(): K {
    return super.keys().next().value;
  }

}

export default LRUMap;
