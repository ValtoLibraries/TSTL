import { ArrayContainer } from "../base/containers/ArrayContainer";
import { ArrayIterator, ArrayReverseIterator } from "../base/iterators/ArrayIterator";
import { TreeMap } from "./TreeMap";

import { IForwardIterator } from "../iterators/IForwardIterator";
import { _NativeArrayIterator } from "../base/iterators/_NativeArrayIterator";
import { OutOfRange } from "../exceptions/LogicError";
import { Pair } from "../utilities/Pair";
import { not_equal_to } from "../functional/comparators";

/**
 * Vector only for `boolean`.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export class VectorBoolean extends ArrayContainer<boolean, VectorBoolean>
{
	//----
	// first => (index: number)
	// second => (value: boolean)
	//---
	/**
	 * @hidden
	 */
	private data_: TreeMap<number, boolean>;

	/**
	 * @hidden
	 */
	private size_: number;

	/* =========================================================
		CONSTRUCTORS & SEMI-CONSTRUCTORS
			- CONSTRUCTORS
			- ASSIGN & CLEAR
	============================================================
		CONSTURCTORS
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 */
	public constructor();

	/**
	 * Initializer Constructor.
	 * 
	 * @param items Items to assign.
	 */
	public constructor(array: boolean[]);

	/**
	 * Copy Constructor
	 * 
	 * @param obj Object to copy.
	 */
	public constructor(obj: VectorBoolean);

	/**
	 * Fill Constructor.
	 * 
	 * @param size Initial size.
	 * @param val Value to fill.
	 */
	public constructor(n: number, val: boolean);

	/**
	 * Range Constructor.
	 * 
	 * @param first Input iterator of the first position.
	 * @param last Input iteartor of the last position.
	 */
	public constructor(first: Readonly<IForwardIterator<boolean>>, last: Readonly<IForwardIterator<boolean>>);

	public constructor(...args: any[])
	{
		super();

		if (args.length === 1 && args[0] instanceof VectorBoolean)
		{
			// COPY CONSTRUCTOR
			let obj: VectorBoolean = args[0];

			this.data_ = new TreeMap(obj.data_.begin(), obj.data_.end());
			this.size_ = obj.size_;
		}
		else if (args.length === 1 && args[0] instanceof Array)
		{
			// INITIALIZER
			this.clear();
			this.push(...args[0]);
		}
		else if (args.length === 2)
		{
			// ASSIGNER
			this.assign(args[0], args[1]);
		}
		else // DEFAULT CONSTRUCTOR
			this.clear();
	}

	/* ---------------------------------------------------------
		ASSIGN & CLEAR
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
	 */
	public assign(n: number, val: boolean): void;
	/**
	 * @inheritDoc
	 */
	public assign<InputIterator extends Readonly<IForwardIterator<boolean, InputIterator>>>
		(first: InputIterator, last: InputIterator): void;
	
	public assign(first: any, last: any): void
	{
		this.clear();
		this.insert(this.end(), first, last);
	}

	/**
	 * @inheritDoc
	 */
	public clear(): void
	{
		this.data_ = new TreeMap();
		this.size_ = 0;
	}

	/**
	 * @inheritDoc
	 */
	public resize(n: number): void
	{
		let expansion: number = n - this.size();
		if (expansion > 0)
			this.insert(this.end(), expansion, false);
		else if (expansion < 0)
			this.erase(this.end().advance(-expansion), this.end());
	}

	/**
	 * Flip all values.
	 */
	public flip(): void
	{
		for (let entry of this.data_)
			entry.second = !entry.second;
	}

	/**
	 * @inheritDoc
	 */
	public swap(obj: VectorBoolean): void
	{
		[this.data_, obj.data_] = [obj.data_, this.data_];
		[this.size_, obj.size_] = [obj.size_, this.size_];
	}

	/* =========================================================
		ACCESSORS
	========================================================= */
	/**
	 * @inheritDoc
	 */
	public size(): number
	{
		return this.size_;
	}

	/**
	 * @inheritDoc
	 */
	public at(index: number): boolean
	{
		// IS OUT OF RANGE?
		if (index < 0 || index > this.size())
			throw new OutOfRange("Target index is greater than Vector's size.");

		// FIND THE NEAREST NODE OF LEFT
		let it = this._Find_node(index);
		return it.second; // RETURNS
	}

	/**
	 * @inheritDoc
	 */
	public set(index: number, val: boolean): void
	{
		val = !!val; // SIFT

		//----
		// PRELIMINARIES
		//----
		// IS OUT OF RANGE?
		if (index < 0 || index > this.size())
			throw new OutOfRange("Target index is greater than Vector's size.");

		// FIND THE NEAREAST NODE OF LEFT
		let it = this._Find_node(index);
		if (it.second === val)
			return; // NO NEED TO CHANGE

		//----
		// CHANGE VALUE
		//----
		if (it.first === index)
		{
			// CHANGE VALUE DIRECTLY
			it.second = val;
		}
		else
		{
			// EMPLACE NEW NODE
			it = this.data_.emplace(index, val).first;
		}

		//----
		// POST-PROCESS
		//----
		// THE LAST ELEMENT, NO POST-PROCESS REQUIRED
		if (index === this.size() - 1)
			return;

		// LIST UP NEIGHBORS
		let prev = it.prev();
		let next = it.next();

		// ARRANGE LEFT SIDE
		if (not_equal_to(prev, this.data_.end()) && prev.second === it.second)
			this.data_.erase(it);

		// ARRANGE RIGHT SIDE
		if (next.equals(this.data_.end()) === true 
			|| (next.first !== index + 1 || next.second !== val))
		{
			// 1) IT'S THE LAST NODE
			// 2) NEXT NODE DOES NOT POINT THE INDEX + 1 (NEAREST NEIGHBOR)
			// 3) NEXT NODE'S VALUE IS DIFFERENT WITH THE CHANGED VALUE
			//----
			// EMPLACE NEW NODE WITH OLD
			this.data_.emplace(index + 1, !val);
		}
		else 
		{
			// NEXT NODE'S VALUE IS SAME WITH THE CHANGED VALUE
			//----
			// ERASE THE NEXT NODE
			this.data_.erase(next);
		}
	}

	/**
	 * @hidden
	 */
	private _Find_node(index: number): TreeMap.Iterator<number, boolean>
	{
		return this.data_.upper_bound(index).prev();
	}

	/* =========================================================
		ELEMENTS I/O
			- PUSH & POP
			- INSERT
			- ERASE
	============================================================
		PUSH & POP
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
	 */
	public push(...items: boolean[]): number
	{
		if (items.length === 0)
			return this.size();

		let first = new _NativeArrayIterator(items, 0);
		let last = new _NativeArrayIterator(items, items.length);

		this._Insert_by_range(this.end(), first, last);
		return this.size();
	}

	/**
	 * @inheritDoc
	 */
	public push_back(val: boolean): void
	{
		let it = this.data_.rbegin();
		let index: number = this.size_++;

		val = !!val; // SIFT

		// EMPLACE OR NOT
		if (this.data_.empty() || it.second !== val)
			this.data_.emplace(index, val);
	}

	/**
	 * @inheritDoc
	 */
	public pop_back(): void
	{
		if (this.empty())
			return; // TODO: THROW EXCEPTION

		let it = this.data_.rbegin();
		let index: number = --this.size_;

		// ERASE OR NOT
		if (it.first === index)
			this.data_.erase(it.base());
	}

	/* ---------------------------------------------------------
		INSERT
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Insert_by_repeating_val(pos: VectorBoolean.Iterator, n: number, val: boolean): VectorBoolean.Iterator
	{
		// RESERVE ELEMENTS -> THE REPEATED COUNT AND VALUE
		let elements: Pair<number, boolean>[] = [];
		elements.push(new Pair(n, val));

		// DO INSERT
		if (pos.equals(this.end()) === true)
			return this._Insert_to_end(elements);
		else
			return this._Insert_to_middle(pos, elements);
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_range<InputIterator extends Readonly<IForwardIterator<boolean, InputIterator>>>
		(pos: VectorBoolean.Iterator, first: InputIterator, last: InputIterator): VectorBoolean.Iterator
	{
		// RESERVE ELEMENTS -> REPEATED SIZE & VALUE
		let elements: Pair<number, boolean>[] = [];

		for (let it = first; !it.equals(last); it = it.next())
		{
			if (elements.length === 0 || elements[elements.length - 1].second !== it.value)
				elements.push(new Pair(1, it.value));
			else
				++elements[elements.length - 1].first;
		}

		if (pos.equals(this.end()) === true)
			return this._Insert_to_end(elements);
		else
			return this._Insert_to_middle(pos, elements);
	}

	/**
	 * @hidden
	 */
	private _Insert_to_middle(pos: VectorBoolean.Iterator, elements: Pair<number, boolean>[]): VectorBoolean.Iterator
	{
		let first = this._Find_node(pos.index());

		for (let it = first; !it.equals(this.data_.end()); it = it.next())
		{
			// COMPUTE SIZE TO ENROLL
			let next: TreeMap.Iterator<number, boolean> = it.next();

			let sx: number = (it.first < pos.index()) 
				? pos.index() // POSITION TO INSERT
				: it.first; // CURRENT POINT
			let sy: number = next.equals(this.data_.end()) 
				? this.size() // IT'S THE LAST ELEMENT
				: next.first; // TO NEXT ELEMENT

			// DO ENROLL
			let size: number = sy - sx;
			let value: boolean = !!it.second;

			elements.push(new Pair(size, value));
		}

		// ERASE BACK-SIDE ELEMENTS FOR THE POST-INSERTION
		this.size_ = pos.index();
		this.data_.erase
		(
			first.first === pos.index() 
				? first 
				: first.next(), 
			this.data_.end()
		);

		// DO POST-INSERTION
		return this._Insert_to_end(elements);
	}
	
	/**
	 * @hidden
	 */
	private _Insert_to_end(elements: Pair<number, boolean>[]): VectorBoolean.Iterator
	{
		let old_size: number = this.size();
		let last_value: boolean = this.data_.empty() ? null : this.data_.rbegin().second;

		for (let i: number = 0; i < elements.length; ++i)
		{
			let p: Pair<number, boolean> = elements[i];

			// INDEXING
			let index: number = this.size();
			let value: boolean = !!p.second;

			this.size_ += p.first;

			// NEED NOT TO EMPLACE, JUST SKIP
			if (i === 0 && value === last_value)
				continue;

			// DO EMPLACE
			this.data_.emplace(index, value);
		}
		return this.begin().advance(old_size);
	}

	/* ---------------------------------------------------------
		ERASE
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Erase_by_range(first: VectorBoolean.Iterator, last: VectorBoolean.Iterator): VectorBoolean.Iterator
	{
		let elements: Pair<number, boolean>[] = [];

		if (last.equals(this.end()) === false)
		{
			let last_index: number = Math.min(this.size(), last.index());

			for (let it = this._Find_node(last_index); !it.equals(this.data_.end()); it = it.next())
			{
				let next: TreeMap.Iterator<number, boolean> = it.next();
				let sx: number = Math.max(it.first, last_index);
				let sy: number = next.equals(this.data_.end()) 
					? this.size() // IT'S THE LAST ELEMENT
					: next.first; // TO NEXT ELEMENT
				let size: number = sy - sx;
				let value: boolean = it.second;
				
				elements.push(new Pair(size, value));
			}
		}

		this.size_ = first.index();
		this.data_.erase
		(
			this.data_.lower_bound(this.size_),
			this.data_.end()
		);
		return this._Insert_to_end(elements);
	}
}

export namespace VectorBoolean
{
	//----
	// PASCAL NOTATION
	//----
	// HEAD
	export type Iterator = ArrayIterator<boolean, VectorBoolean>;
	export type ReverseIterator = ArrayReverseIterator<boolean, VectorBoolean>;

	// BODY
	export const Iterator = ArrayIterator;
	export const ReverseIterator = ArrayReverseIterator;

	//----
	// SNAKE NOTATION
	//----
	// HEAD
	export type iterator = Iterator;
	export type reverse_iterator = ReverseIterator;

	// BODY
	export const iterator = Iterator;
	export const reverse_iterator = ReverseIterator;
}
export import vetor_bool = VectorBoolean;