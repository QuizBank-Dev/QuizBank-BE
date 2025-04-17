import { CategoryType } from 'src/modules/quizbook/schema/quizbook.schema';
import { GeminiResponse } from '../ai.types';

export function getEnglishCategory(category: CategoryType) {
	switch (category) {
		case CategoryType.DATA_STRUCTURE:
			return 'Data Structures';
		case CategoryType.ALGORITHM:
			return 'Algorithms';
		case CategoryType.NETWORK:
			return 'Computer Networks';
		case CategoryType.DATABASE:
			return 'Databases';
		case CategoryType.WEB:
			return 'Web Development';
		case CategoryType.ETC:
		default:
			return 'General Computer Science';
	}
}

export function cleanRefinedAnswer(raw: GeminiResponse) {
	const rawText = raw.candidates[0].content.parts[0].text ?? '';

	return rawText
		.trim()
		.replace(/\n+/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/[*_`~>]/g, '')
		.replace(/[“”]/g, '"')
		.replace(/[‘’]/g, "'")
		.replace(/^\.+|\.+$/g, '')
		.trim();
}
