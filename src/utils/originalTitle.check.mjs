import assert from 'node:assert/strict';
import {
	detailOriginalTitleSubtitle,
	distinctOriginalTitle,
	eligibleOriginalTitle,
	formatInlineTitle
} from './originalTitle.js';

// eligibleOriginalTitle excludes Episode and Season
assert.equal(eligibleOriginalTitle({ Type: 'Movie', OriginalTitle: 'Goodfellas' }), 'Goodfellas');
assert.equal(eligibleOriginalTitle({ Type: 'Series', OriginalTitle: 'Dark' }), 'Dark');
assert.equal(eligibleOriginalTitle({ Type: 'Episode', OriginalTitle: 'Pilote' }), null);
assert.equal(eligibleOriginalTitle({ Type: 'Season', OriginalTitle: 'Saison 1' }), null);
assert.equal(eligibleOriginalTitle(null), null);

// distinctOriginalTitle folds case and Latin diacritics (precomposed & decomposed)
assert.equal(distinctOriginalTitle('Goodfellas', null), null);
assert.equal(distinctOriginalTitle('Goodfellas', '   '), null);
assert.equal(distinctOriginalTitle('Goodfellas', 'goodfellas'), null);
assert.equal(distinctOriginalTitle('Amelie', 'Amélie'), null);
assert.equal(distinctOriginalTitle('Amelie', 'Ame\u0301lie'), null);

// distinctOriginalTitle preserves non-Latin scripts and non-Latin combining marks
assert.equal(distinctOriginalTitle('Les Affranchis', ' Goodfellas '), 'Goodfellas');
assert.equal(distinctOriginalTitle('Spirited Away', '千と千尋の神隠し'), '千と千尋の神隠し');
assert.equal(distinctOriginalTitle('Parasite', '기생충'), '기생충');
assert.equal(distinctOriginalTitle('и', 'и\u0306'), 'и\u0306');

// formatInlineTitle
assert.equal(formatInlineTitle('Les Affranchis', 'Goodfellas', 'off'), 'Les Affranchis');
assert.equal(formatInlineTitle('Les Affranchis', 'Goodfellas', 'replace'), 'Goodfellas');
assert.equal(formatInlineTitle('Les Affranchis', 'Goodfellas', 'parentheses'), 'Les Affranchis (Goodfellas)');
assert.equal(formatInlineTitle('Les Affranchis', 'Goodfellas', 'subtitle'), 'Les Affranchis');
assert.equal(formatInlineTitle('Goodfellas', 'Goodfellas', 'parentheses'), 'Goodfellas');

// detailOriginalTitleSubtitle
assert.equal(detailOriginalTitleSubtitle('Les Affranchis', 'Goodfellas', 'off', true), null);
assert.equal(detailOriginalTitleSubtitle('Les Affranchis', 'Goodfellas', 'replace', true), 'Goodfellas');
assert.equal(detailOriginalTitleSubtitle('Les Affranchis', 'Goodfellas', 'subtitle', true), 'Goodfellas');
assert.equal(detailOriginalTitleSubtitle('Les Affranchis', 'Goodfellas', 'parentheses', true), '(Goodfellas)');
assert.equal(detailOriginalTitleSubtitle('Les Affranchis', 'Goodfellas', 'subtitle', false), 'Goodfellas');
assert.equal(detailOriginalTitleSubtitle('Les Affranchis', 'Goodfellas', 'replace', false), null);
assert.equal(detailOriginalTitleSubtitle('Les Affranchis', 'Goodfellas', 'parentheses', false), null);
