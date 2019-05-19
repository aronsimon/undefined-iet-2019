/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

///<reference path='../resources/jest.d.ts'/>

declare var Symbol: any;
import { fromJS, is, List, Map, OrderedSet, Seq, Set } from '../';

describe('Set', () => {
  it('accepts array of values', () => {
    const s = Set([1, 2, 3]);
    expect(s.has(1)).toBe(true);
    expect(s.has(2)).toBe(true);
    expect(s.has(3)).toBe(true);
    expect(s.has(4)).toBe(false);
  });

  it('accepts array-like of values', () => {
    const s = Set<any>({ length: 3, 2: 3 } as any);
    expect(s.size).toBe(2);
    expect(s.has(undefined)).toBe(true);
    expect(s.has(3)).toBe(true);
    expect(s.has(2)).toBe(false);
  });

  it('accepts string, an array-like collection', () => {
    const s = Set('abc');
    expect(s.size).toBe(3);
    expect(s.has('a')).toBe(true);
    expect(s.has('b')).toBe(true);
    expect(s.has('c')).toBe(true);
    expect(s.has('abc')).toBe(false);
  });

  it('accepts sequence of values', () => {
    const seq = Seq([1, 2, 3]);
    const s = Set(seq);
    expect(s.has(1)).toBe(true);
    expect(s.has(2)).toBe(true);
    expect(s.has(3)).toBe(true);
    expect(s.has(4)).toBe(false);
  });

  it('accepts a keyed Seq as a set of entries', () => {
    const seq = Seq({ a: null, b: null, c: null }).flip();
    const s = Set(seq);
    expect(s.toArray()).toEqual([[null, 'a'], [null, 'b'], [null, 'c']]);
    // Explicitly getting the values sequence
    const s2 = Set(seq.valueSeq());
    expect(s2.toArray()).toEqual(['a', 'b', 'c']);
    // toSet() does this for you.
    const v3 = seq.toSet();
    expect(v3.toArray()).toEqual(['a', 'b', 'c']);
  });

  it('accepts object keys', () => {
    const s = Set.fromKeys({ a: null, b: null, c: null });
    expect(s.has('a')).toBe(true);
    expect(s.has('b')).toBe(true);
    expect(s.has('c')).toBe(true);
    expect(s.has('d')).toBe(false);
  });

  it('accepts sequence keys', () => {
    const seq = Seq({ a: null, b: null, c: null });
    const s = Set.fromKeys(seq);
    expect(s.has('a')).toBe(true);
    expect(s.has('b')).toBe(true);
    expect(s.has('c')).toBe(true);
    expect(s.has('d')).toBe(false);
  });

  it('accepts explicit values', () => {
    const s = Set([1, 2, 3]);
    expect(s.has(1)).toBe(true);
    expect(s.has(2)).toBe(true);
    expect(s.has(3)).toBe(true);
    expect(s.has(4)).toBe(false);
  });

  it('converts back to JS array', () => {
    const s = Set([1, 2, 3]);
    expect(s.toArray()).toEqual([1, 2, 3]);
  });

  it('converts back to JS object', () => {
    const s = Set.of('a', 'b', 'c');
    expect(s.toObject()).toEqual({ a: 'a', b: 'b', c: 'c' });
  });

  it('maps no-ops return the same reference', () => {
    const s = Set([1, 2, 3]);
    const r = s.map(value => value);
    expect(r).toBe(s);
  });

  it('maps should produce new set if values changed', () => {
    const s = Set([1, 2, 3]);
    expect(s.has(4)).toBe(false);
    expect(s.size).toBe(3);

    const m = s.map(v => v + 1);
    expect(m.has(1)).toBe(false);
    expect(m.has(2)).toBe(true);
    expect(m.has(3)).toBe(true);
    expect(m.has(4)).toBe(true);
    expect(m.size).toBe(3);
  });

  it('unions an unknown collection of Sets', () => {
    const abc = Set(['a', 'b', 'c']);
    const cat = Set(['c', 'a', 't']);
    expect(Set.union([abc, cat]).toArray()).toEqual(['c', 'a', 't', 'b']);
    expect(Set.union([abc])).toBe(abc);
    expect(Set.union([])).toBe(Set());
  });

  it('intersects an unknown collection of Sets', () => {
    const abc = Set(['a', 'b', 'c']);
    const cat = Set(['c', 'a', 't']);
    expect(Set.intersect([abc, cat]).toArray()).toEqual(['c', 'a']);
    expect(Set.intersect([abc])).toBe(abc);
    expect(Set.intersect([])).toBe(Set());
  });

  it('iterates values', () => {
    const s = Set([1, 2, 3]);
    const iterator = jest.fn();
    s.forEach(iterator);
    expect(iterator.mock.calls).toEqual([[1, 1, s], [2, 2, s], [3, 3, s]]);
  });

  it('unions two sets', () => {
    const s1 = Set.of('a', 'b', 'c');
    const s2 = Set.of('d', 'b', 'wow');
    const s3 = s1.union(s2);
    expect(s3.toArray()).toEqual(['a', 'b', 'c', 'd', 'wow']);
  });

  it('returns self when union results in no-op', () => {
    const s1 = Set.of('a', 'b', 'c');
    const s2 = Set.of('c', 'a');
    const s3 = s1.union(s2);
    expect(s3).toBe(s1);
  });

  it('returns arg when union results in no-op', () => {
    const s1 = Set();
    const s2 = Set.of('a', 'b', 'c');
    const s3 = s1.union(s2);
    expect(s3).toBe(s2);
  });

  it('unions a set and another collection and returns a set', () => {
    const s1 = Set([1, 2, 3]);
    const emptySet = Set();
    const l = List([1, 2, 3]);
    const s2 = s1.union(l);
    const s3 = emptySet.union(l);
    const o = OrderedSet([1, 2, 3]);
    const s4 = s1.union(o);
    const s5 = emptySet.union(o);
    expect(Set.isSet(s2)).toBe(true);
    expect(Set.isSet(s3)).toBe(true);
    expect(Set.isSet(s4) && !OrderedSet.isOrderedSet(s4)).toBe(true);
    expect(Set.isSet(s5) && !OrderedSet.isOrderedSet(s5)).toBe(true);
  });

  it('is persistent to adds', () => {
    const s1 = Set();
    const s2 = s1.add('a');
    const s3 = s2.add('b');
    const s4 = s3.add('c');
    const s5 = s4.add('b');
    expect(s1.size).toBe(0);
    expect(s2.size).toBe(1);
    expect(s3.size).toBe(2);
    expect(s4.size).toBe(3);
    expect(s5.size).toBe(3);
  });

  it('is persistent to deletes', () => {
    const s1 = Set();
    const s2 = s1.add('a');
    const s3 = s2.add('b');
    const s4 = s3.add('c');
    const s5 = s4.remove('b');
    expect(s1.size).toBe(0);
    expect(s2.size).toBe(1);
    expect(s3.size).toBe(2);
    expect(s4.size).toBe(3);
    expect(s5.size).toBe(2);
    expect(s3.has('b')).toBe(true);
    expect(s5.has('b')).toBe(false);
  });

  it('deletes down to empty set', () => {
    const s = Set.of('A').remove('A');
    expect(s).toBe(Set());
  });

  it('unions multiple sets', () => {
    const s = Set.of('A', 'B', 'C').union(
      Set.of('C', 'D', 'E'),
      Set.of('D', 'B', 'F')
    );
    expect(s).toEqual(Set.of('A', 'B', 'C', 'D', 'E', 'F'));
  });

  it('intersects multiple sets', () => {
    const s = Set.of('A', 'B', 'C').intersect(
      Set.of('B', 'C', 'D'),
      Set.of('A', 'C', 'E')
    );
    expect(s).toEqual(Set.of('C'));
  });

  it('diffs multiple sets', () => {
    const s = Set.of('A', 'B', 'C').subtract(
      Set.of('C', 'D', 'E'),
      Set.of('D', 'B', 'F')
    );
    expect(s).toEqual(Set.of('A'));
  });

  it('expresses value equality with set sequences', () => {
    const s1 = Set.of('A', 'B', 'C');
    expect(s1.equals(null)).toBe(false);

    const s2 = Set.of('C', 'B', 'A');
    expect(s1 === s2).toBe(false);
    expect(is(s1, s2)).toBe(true);
    expect(s1.equals(s2)).toBe(true);

    // Map and Set are not the same (keyed vs unkeyed)
    const v1 = Map({ A: 'A', C: 'C', B: 'B' });
    expect(is(s1, v1)).toBe(false);
  });

  it('group even and odd numbers', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const grpby = set.groupBy(x => x % 2 === 0).toMap().toArray().toString();
    expect(grpby).toEqual(
      Map({ false: Set.of(1, 3, 5, 7, 9), true: Set.of(2, 4, 6, 8, 10) }).toArray().toString()
    );
  });

  it('can use multiple add in a withMutation', () => {
    const set1 = Set();
    const set2 = set1.withMutations(set => set.add(1).add(2).add(3));
    expect(set1.size === 0);
    expect(set2.size === 3);
    expect(set2).toEqual(Set.of(1, 2, 3));
  });

  it('ordering when converts to Seq', () => {
    const set = Set.of(10, 2, 9, 4, 8, 6, 7, 5, 1, 3);
    const seqFromSet = set.toSeq().toArray();
    expect(seqFromSet).toEqual(Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).toArray());
  });

  it('add key in toMap conversion', () => {
    const set = Set.of('apple', 'banana', 'carrot');
    const map = Map({ apple: 'apple', banana: 'banana', carrot: 'carrot' });
    const mapFromSet = set.toMap();
    expect(mapFromSet).toEqual(map);
  });

  it('slice a portion from a Set', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const portion = set.slice(1, 7);
    expect(portion).toEqual(Set.of(2, 3, 4, 5, 6, 7));
  });

  it('make a new Set without the first item', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.rest();
    expect(newSet).toEqual(Set.of(2, 3, 4, 5, 6, 7, 8, 9, 10));
  });

  it('make a new Set without the last item', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.butLast();
    expect(newSet).toEqual(Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9));
  });

  it('make a new Set without the first 4 items', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.skip(4);
    expect(newSet).toEqual(Set.of(5, 6, 7, 8, 9, 10));
  });

  it('make a new Set without the last 5 items', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.skipLast(5);
    expect(newSet).toEqual(Set.of(1, 2, 3, 4, 5));
  });

  it('make a new Set without items that less than 7', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.skipWhile(x => x < 7);
    expect(newSet).toEqual(Set.of(7, 8, 9, 10));
  });

  it('make a new Set only with items that greater than 6', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.skipUntil(x => x > 6);
    expect(newSet).toEqual(Set.of(7, 8, 9, 10));
  });

  it('make a new Set only with the first 4 items', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.take(4);
    expect(newSet).toEqual(Set.of(1, 2, 3, 4));
  });

  it('make a new Set only with the last 2 items', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.takeLast(2);
    expect(newSet).toEqual(Set.of(9, 10));
  });

  it('make a new Set without items that greater than 3', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.takeWhile(x => x < 4);
    expect(newSet).toEqual(Set.of(1, 2, 3));
  });

  it('make a new Set only with items that less than 10', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const newSet = set.takeUntil(x => x > 9);
    expect(newSet).toEqual(Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9));
  });

  it('reduce a Set from left', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const reducedSet = set.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    expect(reducedSet).toEqual(55);
  });

  it('reduce a Set from right', () => {
    const set = Set.of('t', 'a', 'e', 'r', 'g')
    const reducedSet = set.reduceRight((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, '');
    expect(reducedSet).toEqual('great');
  });

  it('every elements are even', () => {
    const set = Set.of(0, 2, 4, 6, 8, 10);
    let isAllEven = set.every(x => x % 2 === 0)
    expect(isAllEven).toEqual(true);
  });

  it('not all elements are even', () => {
    const set = Set.of(0, 1, 2, 4, 6, 8, 10);
    let isAllEven = set.every(x => x % 2 === 0)
    expect(isAllEven).toEqual(false);
  });

  it('some elements are odd', () => {
    const set = Set.of(0, 1, 2, 4, 6, 8, 10);
    const isAllEven = set.some(x => x % 2 === 1)
    expect(isAllEven).toEqual(true);
  });

  it('join Set\'s values as a string (default separator)', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const output = set.join();
    expect(output).toEqual('1,2,3,4,5,6,7,8,9,10');
  });

  it('join Set\'s values as a string ( ; separator)', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const output = set.join(';');
    expect(output).toEqual('1;2;3;4;5;6;7;8;9;10');
  });

  it('test an empty Set', () => {
    const set = Set();
    const isEmpty = set.isEmpty();
    expect(isEmpty).toEqual(true);
  });

  it('count elements of a Set', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const count = set.count();
    expect(count).toEqual(10);
  });

  it('count odd elements of a Set', () => {
    const set = Set.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const count = set.countBy(x => x % 2 === 1).toArray().toString();
    expect(count).toEqual(Map({ true: 5, false: 5 }).toArray().toString());
  });

  it('can use union in a withMutation', () => {
    const js = Set()
      .withMutations(set => {
        set.union(['a']);
        set.add('b');
      })
      .toJS();
    expect(js).toEqual(['a', 'b']);
  });

  it('can determine if an array is a subset', () => {
    const s = Set.of('A', 'B', 'C');
    expect(s.isSuperset(['B', 'C'])).toBe(true);
    expect(s.isSuperset(['B', 'C', 'D'])).toBe(false);
  });

  describe('accepts Symbol as entry #579', () => {
    if (typeof Symbol !== 'function') {
      Symbol = function (key) {
        return { key, __proto__: Symbol };
      };
      Symbol.toString = function () {
        return 'Symbol(' + (this.key || '') + ')';
      };
    }

    it('operates on small number of symbols, preserving set uniqueness', () => {
      const a = Symbol();
      const b = Symbol();
      const c = Symbol();

      const symbolSet = Set([a, b, c, a, b, c, a, b, c, a, b, c]);
      expect(symbolSet.size).toBe(3);
      expect(symbolSet.has(b)).toBe(true);
      expect(symbolSet.get(c)).toEqual(c);
    });

    it('operates on a large number of symbols, maintaining obj uniqueness', () => {
      const manySymbols = [
        Symbol('a'),
        Symbol('b'),
        Symbol('c'),
        Symbol('a'),
        Symbol('b'),
        Symbol('c'),
        Symbol('a'),
        Symbol('b'),
        Symbol('c'),
        Symbol('a'),
        Symbol('b'),
        Symbol('c'),
      ];

      const symbolSet = Set(manySymbols);
      expect(symbolSet.size).toBe(12);
      expect(symbolSet.has(manySymbols[10])).toBe(true);
      expect(symbolSet.get(manySymbols[10])).toEqual(manySymbols[10]);
    });
  });

  it('can use intersect after add or union in a withMutation', () => {
    const set = Set(['a', 'd']).withMutations(s => {
      s.add('b');
      s.union(['c']);
      s.intersect(['b', 'c', 'd']);
    });
    expect(set.toArray()).toEqual(['c', 'd', 'b']);
  });

  it('can count entries that satisfy a predicate', () => {
    const set = Set([1, 2, 3, 4, 5]);
    expect(set.size).toEqual(5);
    expect(set.count()).toEqual(5);
    expect(set.count(x => x % 2 === 0)).toEqual(2);
    expect(set.count(x => true)).toEqual(5);
  });

  describe('"size" should correctly reflect the number of elements in a Set', () => {
    describe('deduplicating custom classes that invoke fromJS() as part of equality check', () => {
      class Entity {
        constructor(entityId, entityKey) {
          this.entityId = entityId;
          this.entityKey = entityKey;
        }
        asImmutable() {
          return fromJS({
            entityId: this.entityId,
            entityKey: this.entityKey,
          });
        }
        valueOf() {
          return this.asImmutable().toString();
        }
      }
      it('with mutations', () => {
        const testSet = Set().withMutations(mutableSet => {
          mutableSet.add(new Entity('hello', 'world'));
          mutableSet.add(new Entity('testing', 'immutable'));
          mutableSet.add(new Entity('hello', 'world'));
        });
        expect(testSet.size).toEqual(2);
      });
      it('without mutations', () => {
        const testSet0 = Set();
        const testSet1 = testSet0.add(new Entity('hello', 'world'));
        const testSet2 = testSet1.add(new Entity('testing', 'immutable'));
        const testSet3 = testSet2.add(new Entity('hello', 'world'));
        expect(testSet0.size).toEqual(0);
        expect(testSet1.size).toEqual(1);
        expect(testSet2.size).toEqual(2);
        expect(testSet3.size).toEqual(2);
      });
    });
  });

  describe('get', () => {
    it('gets any index', () => {
      const set = Set.of(0, 1, 2, 3, 4, 5);
      expect(set.get(4)).toBe(4);
    });

    it('gets first', () => {
      const set = Set.of(0, 1, 2, 3, 4, 5);
      expect(set.first()).toBe(0);
    });

    it('gets last', () => {
      const set = Set.of(0, 1, 2, 3, 4, 5);
      expect(set.last()).toBe(5);
    });

    it('gets first after reversing', () => {
      const set = Set.of(0, 1, 2, 3, 4, 5).reverse();
      expect(set.first()).toBe(5);
    });

    it('gets last after reversing', () => {
      const set = Set.of(0, 1, 2, 3, 4, 5).reverse();
      expect(set.last()).toBe(0);
    });

    it('gets first when size is unknown', () => {
      const set = Set.of(0, 1, 2, 3, 4, 5).filter(x => x % 2 === 1);
      expect(set.first()).toBe(1);
    });

    it('gets last when size is unknown', () => {
      const set = Set.of(0, 1, 2, 3, 4, 5).filter(x => x % 2 === 1);
      expect(set.last()).toBe(5); // Note: this is O(N)
    });
  });
});
