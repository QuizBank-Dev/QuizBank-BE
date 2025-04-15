import { FilterQuery, Model, PopulateOptions, SortOrder } from 'mongoose';
import { PaginationResponseDto } from '../dto/pagination.dto';

export type CursorValue = string | number | Date;

interface PaginationParams<T> {
	model: Model<T>;
	filter?: FilterQuery<T>;
	cursor?: Record<string, CursorValue>;
	limit?: number;
	sortOption?: Record<string, SortOrder>;
	populate?: PopulateOptions;
}

export async function pagination<T>({
	model,
	filter = {},
	cursor,
	limit = 5,
	sortOption = { _id: -1 },
	populate,
}: PaginationParams<T>): Promise<PaginationResponseDto<T>> {
	const cursorFilter = buildCursorFilter<T>(cursor, sortOption);
	const finalFilter: FilterQuery<T> = cursorFilter
		? { $and: [filter, cursorFilter] }
		: filter;

	let query = model.find(finalFilter).sort(sortOption).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	const [data, totalCount] = await Promise.all([
		query.lean(),
		model.countDocuments(filter),
	]);

	const lastItem = data[data.length - 1];
	const nextCursor =
		data.length === limit
			? Object.keys(sortOption).reduce(
					(acc, key) => {
						acc[key] = lastItem[key] as CursorValue;
						return acc;
					},
					{} as Record<string, CursorValue>,
				)
			: null;

	return {
		data: data as T[],
		nextCursor,
		totalCount,
	};
}

function buildCursorFilter<T>(
	cursor: Record<string, CursorValue> | undefined,
	sortOption: Record<string, SortOrder> = {},
): FilterQuery<T> | undefined {
	if (!cursor || !Object.keys(cursor).length) return;

	const sortFields = Object.keys(sortOption);
	const orConditions: FilterQuery<T>[] = [];

	sortFields.reduce((_, field, i) => {
		const andCondition: Record<string, unknown> = {};

		sortFields.slice(0, i).forEach((prevField) => {
			andCondition[prevField] = cursor[prevField];
		});

		const direction = sortOption[field];
		const value = cursor[field];
		if (value === undefined) return null;

		andCondition[field] = direction === 1 ? { $gt: value } : { $lt: value };

		orConditions.push(andCondition as FilterQuery<T>);
		return null;
	}, null);

	return { $or: orConditions } as FilterQuery<T>;
}
