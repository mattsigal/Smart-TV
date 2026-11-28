// Folds accented Latin letters onto the plain letter behind them, so searching for "canco" or
// "canço" still turns up "Cançó". The server already does this for the searches it answers, so
// anything matched here has to fold too or the same query finds different things depending on
// which box ran it.

const ACCENT_FOLDS = {
	'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Ā': 'A', 'Ă': 'A', 'Ą': 'A', 'Æ': 'A',
	'Ç': 'C', 'Ć': 'C', 'Č': 'C',
	'Ð': 'D', 'Ď': 'D', 'Đ': 'D',
	'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ē': 'E', 'Ė': 'E', 'Ę': 'E', 'Ě': 'E',
	'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I', 'Ī': 'I', 'Į': 'I',
	'Ł': 'L',
	'Ñ': 'N', 'Ń': 'N', 'Ň': 'N',
	'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ō': 'O', 'Ő': 'O',
	'Ś': 'S', 'Š': 'S', 'Ş': 'S',
	'Þ': 'T',
	'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ū': 'U', 'Ů': 'U', 'Ű': 'U',
	'Ý': 'Y', 'Ÿ': 'Y',
	'Ź': 'Z', 'Ž': 'Z', 'Ż': 'Z'
};

// Every accented letter the table knows comes back as its upper case base letter, combining
// diacritical marks (U+0300-U+036F) after Latin letters are stripped, and anything else is left
// exactly as it was, so compare through foldForSearch or case fold it yourself.
export const foldAccents = (value) => {
	const input = String(value ?? '');
	let out = '';
	let prevIsLatin = false;
	for (let i = 0; i < input.length; i++) {
		const code = input.charCodeAt(i);
		if (code >= 0x0300 && code <= 0x036f) {
			if (!prevIsLatin) out += input.charAt(i);
			continue;
		}
		const ch = input.charAt(i);
		let folded = code >= 0x80 ? ACCENT_FOLDS[ch.toUpperCase()] : null;
		if (!folded && code >= 0x80 && typeof ch.normalize === 'function') {
			const nfd = ch.normalize('NFD');
			const baseCode = nfd.charCodeAt(0);
			if (nfd.length > 1 && ((baseCode >= 0x41 && baseCode <= 0x5a) || (baseCode >= 0x61 && baseCode <= 0x7a))) {
				folded = nfd.charAt(0).toUpperCase();
			}
		}
		prevIsLatin = Boolean(folded) || (code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a);
		out += folded || ch;
	}
	return out;
};

export const foldForSearch = (value) => foldAccents(value).toLowerCase();
