import { foldForSearch } from './accentFolding.js';

export const DETAIL_ORIGINAL_TITLE_MODES = ['off', 'replace', 'subtitle', 'parentheses'];
export const LIBRARY_ORIGINAL_TITLE_MODES = ['off', 'replace', 'parentheses'];

// Excludes episodes and seasons, whose headers already stack show + episode/season lines.
export const eligibleOriginalTitle = (item) => {
	if (!item || item.Type === 'Episode' || item.Type === 'Season') return null;
	return typeof item.OriginalTitle === 'string' ? item.OriginalTitle : null;
};

// Returns trimmed originalTitle when non-empty and distinct from title (case/accent folded).
// Preserves non-Latin scripts verbatim.
export const distinctOriginalTitle = (title, originalTitle) => {
	if (typeof originalTitle !== 'string') return null;
	const trimmedOriginal = originalTitle.trim();
	if (!trimmedOriginal) return null;
	if (foldForSearch(trimmedOriginal) === foldForSearch(String(title || '').trim())) return null;
	return trimmedOriginal;
};

// Formats an inline title (library cards, HUD, and text-only detail headers) according to mode.
export const formatInlineTitle = (title, originalTitle, mode) => {
	const base = title || '';
	const distinct = distinctOriginalTitle(base, originalTitle);
	if (!distinct) return base;
	if (mode === 'replace') return distinct;
	if (mode === 'parentheses') return `${base} (${distinct})`;
	return base;
};

// Returns the secondary original-title line to show beneath a detail screen's title or logo.
// When hasLogo is true, the logo is preserved and the original title is shown underneath
// (wrapped in parentheses for parentheses mode).
export const detailOriginalTitleSubtitle = (title, originalTitle, mode, hasLogo) => {
	if (!mode || mode === 'off') return null;
	const distinct = distinctOriginalTitle(title || '', originalTitle);
	if (!distinct) return null;
	if (hasLogo) return mode === 'parentheses' ? `(${distinct})` : distinct;
	return mode === 'subtitle' ? distinct : null;
};
