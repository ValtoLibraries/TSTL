﻿/// <reference path="API.ts" />

// Iterator definitions.
//
// @reference http://www.cplusplus.com/reference/iterator
// @author Jeongho Nam <http://samchon.org>

namespace std
{
	/**
	 * <p> Bi-directional iterator. </p>
	 *
	 * <p> {@link Iterator Bidirectional iterators} are iterators that can be used to access the sequence of elements 
	 * in a range in both directions (towards the end and towards the beginning). </p>
	 *
	 * <p> All {@link IArrayIterator random-access iterators} are also valid {@link Iterrator bidirectional iterators}. 
	 * </p>
	 *
	 * <p> There is not a single type of {@link Iterator bidirectional iterator}: {@link IContainer Each container} 
	 * may define its own specific iterator type able to iterate through it and access its elements. </p>
	 *
	 * <p> <a href="http://samchon.github.io/tstl/images/class_diagram/abstract_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/tstl/images/class_diagram/abstract_containers.png" style="max-width: 100%" /></a>
	 * </p>
	 *
	 * @reference http://www.cplusplus.com/reference/iterator/BidirectionalIterator
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Iterator<T>
	{
		/**
		 * Source container of the iterator is directing for.
		 */
		protected source_: Array<T> | base.Container<T>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from the source {@link IContainer container}.
		 *
		 * @param source The source container.
		 */
		protected constructor(source: Array<T> | base.Container<T>)
		{
			this.source_ = source;
		}

		/* ---------------------------------------------------------
			MOVERS
		--------------------------------------------------------- */
		/**
		 * <p> Get iterator to previous element. </p>
		 * <p> If current iterator is the first item(equal with {@link IContainer.begin IContainer.begin()}), 
		 * returns {@link IContainer.end IContainer.end()}. </p>
		 *
		 * @return An iterator of the previous item. 
		 */
		public abstract prev(): Iterator<T>;

		/**
		 * <p> Get iterator to next element. </p>
		 * <p> If current iterator is the last item, returns {@link IContainer.end IContainer.end()}. </p>
		 *
		 * @return An iterator of the next item.
		 */
		public abstract next(): Iterator<T>;

		/**
		 * Advances the {@link Iterator} by <i>n</i> element positions.
		 *
		 * @param n Number of element positions to advance.
		 * @return An advanced iterator.
		 */
		public abstract advance(n: number): Iterator<T>;
		//{
		//	let it: Iterator<T> = this;
		//	let i: number;

		//	if (n >= 0 )
		//	{
		//		for (i = 0; i < n; i++)
		//			if (it.equals(this.source_.end()))
		//				return this.source_.end();
		//			else
		//				it = it.next();
		//	}
		//	else
		//	{
		//		n = n * -1;

		//		for (i = 0; i < n; i++)
		//			if (it.equals(this.source_.end()))
		//				return this.source_.end();
		//			else
		//				it = it.prev();
		//	}

		//	return it;
		//}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get source container.
		 */
		public abstract source(): Array<T> | base.Container<T>;

		/**
		 * <p> Whether an iterator is equal with the iterator. </p>
		 * 
		 * <p> Compare two iterators and returns whether they are equal or not. </p>
		 *
		 * <h4> Note </h4>
		 * <p> Iterator's {@link equals equals()} only compare souce container and index number. </p>
		 * 
		 * <p> Although elements in a pair, key and value are {@link std.equal_to equal_to}, if the source map or
		 * index number is different, then the {@link equals equals()} will return false. If you want to
		 * compare the elements of a pair, compare them directly by yourself. </p>
		 *
		 * @param obj An iterator to compare
		 * @return Indicates whether equal or not.
		 */
		public equals(obj: Iterator<T>): boolean
		{
			return this.source_ == obj.source_;
		}
		
		/**
		 * <p> Get value of the iterator is pointing. </p>
		 * 
		 * @return A value of the iterator.
		 */
		public abstract get value(): T; // TS2.0 New Feature

		public abstract swap(obj: Iterator<T>): void;
	}
}

namespace std
{
	/**
	 * <p> This class reverses the direction in which a bidirectional or random-access iterator iterates through a range.
	 * </p>
	 * 
	 * <p> A copy of the original iterator (the {@link Iterator base iterator}) is kept internally and used to reflect 
	 * the operations performed on the {@link ReverseIterator}: whenever the {@link ReverseIterator} is incremented, its 
	 * {@link Iterator base iterator} is decreased, and vice versa. A copy of the {@link Iterator base iterator} with the 
	 * current state can be obtained at any time by calling member {@link base}. </p>
	 * 
	 * <p> Notice however that when an iterator is reversed, the reversed version does not point to the same element in 
	 * the range, but to <b>the one preceding it</b>. This is so, in order to arrange for the past-the-end element of a 
	 * range: An iterator pointing to a past-the-end element in a range, when reversed, is pointing to the last element 
	 * (not past it) of the range (this would be the first element of the reversed range). And if an iterator to the 
	 * first element in a range is reversed, the reversed iterator points to the element before the first element (this 
	 * would be the past-the-end element of the reversed range). </p>
	 * 
	 * <p> <a href="http://samchon.github.io/tstl/images/class_diagram/abstract_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/tstl/images/class_diagram/abstract_containers.png" style="max-width: 100%" /></a>
	 * </p>
	 * 
	 * @reference http://www.cplusplus.com/reference/iterator/reverse_iterator
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ReverseIterator
		<T, Source extends Array<T> | base.Container<T>,
			Base extends Iterator<T>, This extends ReverseIterator<T, Source, Base, This>>
		extends Iterator<T>
	{
		/**
		 * @hidden
		 */
		protected base_: Base;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from base iterator.
		 * 
		 * @param base A reference of the base iterator, which iterates in the opposite direction.
		 */
		protected constructor(base: Base)
		{
			super(base.source());
			this.base_ = base.prev() as Base;
		}

		// CREATE A NEW OBJECT WITH SAME (DERIVED) TYPE
		/**
		 * @hidden
		 */
		protected abstract _Create_neighbor(base: Base): This;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public source(): Source
		{
			return this.base_.source() as Source;
		}

		/**
		 * <p> Return base iterator. </p>
		 * 
		 * <p> Return a reference of the base iteraotr. </p>
		 * 
		 * <p> The base iterator is an iterator of the same type as the one used to construct the {@link ReverseIterator}, 
		 * but pointing to the element next to the one the {@link ReverseIterator} is currently pointing to 
		 * (a {@link ReverseIterator} has always an offset of -1 with respect to its base iterator).
		 * 
		 * @return A reference of the base iterator, which iterates in the opposite direction.
		 */
		public base(): Base
		{
			return this.base_.next() as Base;
		}

		/**
		 * <p> Get value of the iterator is pointing. </p>
		 * 
		 * @return A value of the reverse iterator.
		 */
		public get value(): T
		{
			return this.base_.value;
		}

		/* ---------------------------------------------------------
			MOVERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public prev(): This
		{
			return this._Create_neighbor(this.base().next() as Base);
		}

		/**
		 * @inheritdoc
		 */
		public next(): This
		{
			return this._Create_neighbor(this.base().prev() as Base);
		}

		/**
		 * @inheritdoc
		 */
		public advance(n: number): This
		{
			return this._Create_neighbor(this.base().advance(-n) as Base);
		}

		/* ---------------------------------------------------------
			COMPARES
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public equals(obj: This): boolean
		{
			return this.base_.equals(obj.base_);
		}

		/**
		 * @inheritdoc
		 */
		public swap(obj: This): void
		{
			this.base_.swap(obj.base_);
		}
	}

	/* =========================================================
		GLOBAL FUNCTIONS
			- ACCESSORS
			- MOVERS
			- FACTORY
	============================================================
		ACCESSORS
	--------------------------------------------------------- */
	export function size<T>(array: Array<T>): number;
	export function size<T>(container: base.Container<T>): number;

	export function size<T>(container: Array<T> | base.Container<T>): number {
		if (container instanceof Array)
			return container.length;
		else
			return container.size();
	}

	export function empty<T>(array: Array<T>): boolean;
	export function empty<T>(container: base.Container<T>): boolean;

	export function empty<T>(container: Array<T> | base.Container<T>): boolean {
		return size(container as Array<T>) == 0;
	}

	/**
	 * <p> Return distance between {@link Iterator iterators}. </p>
	 * 
	 * <p> Calculates the number of elements between <i>first</i> and <i>last</i>. </p>
	 * 
	 * <p> If it is a {@link IArrayIterator random-access iterator}, the function uses operator- to calculate this. 
	 * Otherwise, the function uses the increase operator {@link Iterator.next next()} repeatedly. </p>
	 * 
	 * @param first Iterator pointing to the initial element.
	 * @param last Iterator pointing to the final element. This must be reachable from first.
	 *
	 * @return The number of elements between first and last.
	 */
	export function distance<T, InputIterator extends Iterator<T>>
		(first: InputIterator, last: InputIterator): number
	{
		if ((<any>first).index != undefined)
		{
			// WHEN IARRAY_ITERATOR
			// ABS FOR REVERSE_ITERATOR
			return Math.abs((<any>last).index - (<any>first).index);
		}
		
		let length: number = 0;
		for (; !first.equals(last); first = first.next() as InputIterator)
			length++;

		return length;
	}

	/* ---------------------------------------------------------
		MOVERS
	--------------------------------------------------------- */
	/**
	 * <p> Advance iterator. </p>
	 * 
	 * <p> Advances the iterator <i>it</i> by <i>n</i> elements positions. </p>
	 * 
	 * @param it Iterator to be advanced.
	 * @param n Number of element positions to advance.
	 * 
	 * @return An iterator to the element <i>n</i> positions before <i>it</i>.
	 */
	export function advance<T, InputIterator extends Iterator<T>>
		(it: InputIterator, n: number): InputIterator
	{
		return it.advance(n) as InputIterator;
	}
	
	/**
	 * <p> Get iterator to previous element. </p>
	 * 
	 * <p> Returns an iterator pointing to the element that <i>it</i> would be pointing to if advanced <i>-n</i> positions. </p>
	 * 
	 * @param it Iterator to base position.
	 * @param n Number of element positions offset (1 by default).
	 * 
	 * @return An iterator to the element <i>n</i> positions before <i>it</i>.
	 */
	export function prev<T, BidirectionalIterator extends Iterator<T>>
		(it: BidirectionalIterator, n: number = 1): BidirectionalIterator
	{
		return it.advance(n) as BidirectionalIterator;
	}
	
	/**
	 * <p> Get iterator to next element. </p>
	 * 
	 * <p> Returns an iterator pointing to the element that <i>it</i> would be pointing to if advanced <i>n</i> positions. </p>
	 * 
	 * @param it Iterator to base position.
	 * @param n Number of element positions offset (1 by default).
	 * 
	 * @return An iterator to the element <i>n</i> positions away from <i>it</i>.
	 */
	export function next<T, ForwardIterator extends Iterator<T>>
		(it: ForwardIterator, n: number = 1): ForwardIterator
	{	
		return it.advance(n) as ForwardIterator;
	}

	/* ---------------------------------------------------------
		FACTORY
	--------------------------------------------------------- */
	/**
	 * Iterator to beginning.
	 * 
	 * Returns an iterator pointing to the first element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value shall not be dereferenced.
	 * 
	 * @param array An array object.
	 * @return {@link ArrayIterator} object.
	 */
	export function begin<T>(array: Array<T>): ArrayIterator<T>;

	/**
	 * Iterator to beginning.
	 * 
	 * Returns an iterator pointing to the first element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value shall not be dereferenced.
	 * 
	 * @param container A container object of a class type for which member {@link Container.begin begin} is defined.
	 * @return The same as returned by {@link Container.begin container.begin()}.
	 */
	export function begin<T>(container: base.Container<T>): Iterator<T>;

	export function begin<T>(container: Vector<T>): VectorIterator<T>;
	export function begin<T>(container: List<T>): ListIterator<T>;
	export function begin<T>(container: Deque<T>): DequeIterator<T>;
	export function begin<T>(container: base.SetContainer<T>): SetIterator<T>;
	export function begin<Key, T>(container: base.MapContainer<Key, T>): MapIterator<Key, T>;

	// typedef is not specified in TypeScript yet.
	// Instead, I listed all the containers and its iterators as overloaded functions
	export function begin<T>(container: Array<T> | base.Container<T>): Iterator<T>
	{
		if (container instanceof Array)
			return new ArrayIterator(container, container.length ? 0 : -1);
		else
			return container.begin();
	}

	/**
	 * Iterator to reverse-beginning.
	 * 
	 * Returns a reverse iterator pointing to the last element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value shall not be dereferenced.
	 * 
	 * @param array An array object.
	 * @return {@link ArrayIterator} object.
	 */
	export function rbegin<T>(array: Array<T>): ArrayReverseIterator<T>;

	/**
	 * Iterator to reverse-beginning.
	 * 
	 * Returns a reverse iterator pointing to the last element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value shall not be dereferenced.
	 * 
	 * @param container A container object of a class type for which member {@link Container.rbegin rbegin} is defined.
	 * @return The same as returned by {@link Container.rbegin container.rbegin()}.
	 */
	export function rbegin<T>(container: base.Container<T>): base.IReverseIterator<T>;

	export function rbegin<T>(container: Vector<T>): VectorReverseIterator<T>;
	export function rbegin<T>(container: List<T>): ListReverseIterator<T>;
	export function rbegin<T>(container: Deque<T>): DequeReverseIterator<T>;
	export function rbegin<T>(container: base.SetContainer<T>): SetReverseIterator<T>;
	export function rbegin<Key, T>(container: base.MapContainer<Key, T>): MapReverseIterator<Key, T>;

	export function rbegin<T>(container: Array<T> | base.Container<T>): ArrayReverseIterator<T> | base.IReverseIterator<T>
	{
		if (container instanceof Array)
			return new ArrayReverseIterator<T>(end(container));
		else
			return container.rbegin();
	}
	
	/**
	 * Iterator to end.
	 * 
	 * Returns an iterator pointing to the <i>past-the-end</i> element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value compares equal to the one returned by {@link begin} with the same argument.
	 * 
	 * @param array An array object.
	 * @return {@link ArrayIterator} object.
	 */
	export function end<T>(array: Array<T>): ArrayIterator<T>;

	/**
	 * Iterator to end.
	 * 
	 * Returns an iterator pointing to the <i>past-the-end</i> element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value compares equal to the one returned by {@link begin} with the same argument.
	 * 
	 * @param container A container of a class type for which member {@link Container.end end} is defined.
	 * @return The same as returned by {@link Container.end container.end()}.
	 */
	export function end<T>(container: base.Container<T>): Iterator<T>;

	export function end<T>(container: Vector<T>): VectorIterator<T>;
	export function end<T>(container: List<T>): ListIterator<T>;
	export function end<T>(container: Deque<T>): DequeIterator<T>;
	export function end<T>(container: base.SetContainer<T>): SetIterator<T>;
	export function end<Key, T>(container: base.MapContainer<Key, T>): MapIterator<Key, T>;

	export function end<T>(container: Array<T> | base.Container<T>): Iterator<T>
	{
		if (container instanceof Array)
			return new ArrayIterator<T>(container, -1);
		else
			return container.end();
	}

	/**
	 * Iterator to reverse-end.
	 * 
	 * Returns a reverse iterator pointing to the <i>past-the-end</i> element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value compares equal to the one returned by {@link rbegin} with the same argument.
	 * 
	 * @param array An array object.
	 * @return {@link ArrayIterator} object.
	 */
	export function rend<T>(array: Array<T>): ArrayReverseIterator<T>;

	/**
	 * Iterator to reverse-end.
	 * 
	 * Returns an reverse iterator pointing to the <i>past-the-end</i> element in the sequence.
	 * 
	 * If the sequence is {@link empty}, the returned value compares equal to the one returned by {@link rbegin} with the same argument.
	 * 
	 * @param container A container of a class type for which member {@link Container.rend rend} is defined.
	 * @return The same as returned by {@link Container.rend container.rend()}.
	 */
	export function rend<T>(container: base.Container<T>): base.IReverseIterator<T>;

	export function rend<T>(container: Vector<T>): VectorReverseIterator<T>;
	export function rend<T>(container: List<T>): ListReverseIterator<T>;
	export function rend<T>(container: Deque<T>): DequeReverseIterator<T>;
	export function rend<T>(container: base.SetContainer<T>): SetReverseIterator<T>;
	export function rend<Key, T>(container: base.MapContainer<Key, T>): MapReverseIterator<Key, T>;

	export function rend<T>(container: Array<T> | base.Container<T>): ArrayReverseIterator<T> | base.IReverseIterator<T> {
		if (container instanceof Array)
			return new ArrayReverseIterator<T>(begin(container));
		else
			return container.rend();
	}

	export function make_reverse_iterator<T>(it: ArrayIterator<T>): ArrayReverseIterator<T>;
	export function make_reverse_iterator<T>(it: VectorIterator<T>): VectorReverseIterator<T>;
	export function make_reverse_iterator<T>(it: DequeIterator<T>): DequeReverseIterator<T>;
	export function make_reverse_iterator<T>(it: ListIterator<T>): ListReverseIterator<T>;
	export function make_reverse_iterator<T>(it: SetIterator<T>): SetReverseIterator<T>;
	export function make_reverse_iterator<Key, T>(it: MapIterator<Key, T>): MapReverseIterator<Key, T>;

	export function make_reverse_iterator<T>(it: Iterator<T>)
		: ArrayReverseIterator<T> | base.IReverseIterator<T> | MapReverseIterator<any, any>
	{
		// LINEAR CONTAINERS
		if (it instanceof ArrayIterator)
			return new ArrayReverseIterator<T>(it);
		else if (it instanceof VectorIterator)
			return new VectorReverseIterator<T>(it);
		else if (it instanceof DequeIterator)
			return new DequeReverseIterator<T>(it);
		else if (it instanceof ListIterator)
			return new ListReverseIterator<T>(it);

		// ASSOCIATIVE CONTAINERS
		else if (it instanceof SetIterator)
			return new SetReverseIterator<T>(it);
		else if (it instanceof MapIterator)
			return new MapReverseIterator<any, any>(it);
	}
}