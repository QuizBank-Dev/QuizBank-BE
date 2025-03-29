import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { DB_TYPE } from './database.const';
import { ClientSession, Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
	constructor(
		@InjectConnection(DB_TYPE.DEFAULT)
		private readonly defaultDB: Connection,
		@InjectConnection(DB_TYPE.SUB)
		private readonly subDB: Connection,
	) {}

	/**
	 * Default DB 트랜젝션
	 */
	async runInDefaultTransaction<T = void>(
		fn: (session: ClientSession) => Promise<T>,
	): Promise<T> {
		return this.run(this.defaultDB, fn);
	}

	/**
	 * Sub DB 트랜젝션
	 */
	async runInSubTransaction<T = void>(
		fn: (session: ClientSession) => Promise<T>,
	): Promise<T> {
		return this.run(this.subDB, fn);
	}

	private async run<T = void>(
		connection: Connection,
		task: (session: ClientSession) => Promise<T>,
	): Promise<T> {
		// 트랜젝션 시작
		const session = await connection.startSession();
		session.startTransaction();

		try {
			// Task 수행
			const result = await task(session);

			// Task 완료시 트랜잭션 커밋
			await session.commitTransaction();

			return result;
		} catch (e) {
			// 오류시 롤백
			await session.abortTransaction();
			throw new InternalServerErrorException(
				'DB 트랜잭션 작업 중 에러가 발생했습니다.',
			);
		} finally {
			await session.endSession();
		}
	}
}
