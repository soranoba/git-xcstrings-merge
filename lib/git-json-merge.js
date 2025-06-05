var fs = require('fs');
var xdiff = require('xdiff');
var detectIndent = require('detect-indent');

var encoding = 'utf-8';

function mergeJsonFiles (oursFileName, baseFileName, theirsFileName) {
	var oursJson = stripBom(fs.readFileSync(oursFileName, encoding));
	var baseJson = stripBom(fs.readFileSync(baseFileName, encoding));
	var theirsJson = stripBom(fs.readFileSync(theirsFileName, encoding));
	var newOursJson = mergeJson(oursJson, baseJson, theirsJson);
	fs.writeFileSync(oursFileName, newOursJson, encoding);
}

function mergeJson (oursJson, baseJson, theirsJson) {
	var oursIndent = detectIndent(oursJson).indent;
	var baseIndent = detectIndent(baseJson).indent;
	var theirsIndent = detectIndent(theirsJson).indent;
	var newOursIndent = selectIndent(oursIndent, baseIndent, theirsIndent);
	var ours = JSON.parse(oursJson);
	var base = JSON.parse(baseJson);
	var theirs = JSON.parse(theirsJson);
	var newOurs = merge(ours, base, theirs);
	var newOursJson = JSON.stringify(sortKeysRecursively(newOurs), null, newOursIndent);
	// Convert to xcstrings format
	var xcstringsJson = newOursJson.replace(/"((?:\\.|[^"\\])*)"\s*:/g, '"$1" :');
	return xcstringsJson;
}

function merge (ours, base, theirs) {
	var diff = xdiff.diff3(ours, base, theirs);

	if (diff) {
		return xdiff.patch(base, diff);
	}

	return base;
}

function selectIndent (oursIndent, baseIndent, theirsIndent) {
	return oursIndent !== baseIndent ? oursIndent : theirsIndent !== baseIndent ? theirsIndent : baseIndent;
}

function stripBom (str) {
	return str[0] === '\uFEFF' ? str.slice(1) : str;
}

function sortKeysRecursively(obj) {
	if (Array.isArray(obj)) {
		return obj.map(sortKeysRecursively);
	} else if (obj !== null && typeof obj === 'object') {
		return Object.keys(obj)
			.sort()
			.reduce((acc, key) => {
				acc[key] = sortKeysRecursively(obj[key]);
				return acc;
			}, {});
	} else {
		return obj;
	}
}

module.exports = {
	mergeJsonFiles: mergeJsonFiles,
	mergeJson: mergeJson,
	merge: merge,
	selectIndent: selectIndent,
	stripBom: stripBom
}
