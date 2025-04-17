export interface GeminiCandidatePart {
	text: string;
}

export interface GeminiContent {
	parts: GeminiCandidatePart[];
}

export interface GeminiCandidate {
	content: GeminiContent;
	finishReason: string;
}

export interface GeminiResponse {
	candidates: GeminiCandidate[];
}
