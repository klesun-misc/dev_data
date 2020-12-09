

export const someMultilineText = [
  '     *****  AIR  HISTORY  *****',
  'XS UA 126 T20SEP IADDUB SS/HK2  1020P 1025A *',
  'XS LH 416 L21JUN FRAIAD HK/HX2  1045A  125P *',
  'XS LH 595 L20JUN PHCFRA HK/HX2   800P  535A *',
  'RCVD-VERONICA/ZDYB6A  -CR- QSB/2CV4/1V AG 6A 04JUN1719Z',
  'SC LH 416 L21JUN FRAIAD HK/HX2  1045A  125P *',
  'SC LH 595 L20JUN PHCFRA HK/HX2   800P  535A *',
  'RCVD-040004//17CF0584/ NO ID  -CR- MUC/2CV4/UA RM 1A 04JUN0004Z',
  'HS UA 126 T20SEP IADDUB SS/HK2  1020P 1025A *',
  'HS LH 416 L21JUN FRAIAD SS/HK2  1045A  125P *       1',
  'HS LH 595 L20JUN PHCFRA SS/HK2   800P  535A *       1',
  'RCVD-VERONICA/ZDYB6A  -CR- QSB/2CV4/1V AG 6A 02JUN1632Z',
].join('\n');

export const someWrappingMultiLineCode = [
  "        '(?P<departureCity>[A-Z]{3}) ',",
  "        '(',",
  "            '(?P<airline>[A-Z0-9]{2}) ',",
  "            '(?P<stopoverMark>X\/)?',",
  "            '(?P<city>[A-Z]{3})',",
  "            '(',",
  "                '( ',",
  "                    '(?P<fareLetter>[A-Z])( [A-Z]{6})',",
  "                    '(?P<fareAmount>\d+(\.\d+)?)',",
  "                ' ?)?',",
  "                '',",
  "            ')?',",
  "        ')+',",
  "        '(NUC(?P<nucAmount>)\d+(\.\d+)?)?',",
  "        'END',",
  "        '( ROE',",
  "            '(?P<roeAmount>\d+(\.\d+)?) ?',",
  "            '(',",
  "                '(?P<taxCode>[A-Z0-9]{2})',",
  "                '(?P<taxCity>[A-Z]{3})',",
  "                '(?P<taxAmount>\d+(\.\d+)?)',",
  "            ')*',",
  "        ')?',",
].join('\n');

export const fixedWidthCharMapping = {
  '0':  65296, // '０'
  '1':  65297, // '１'
  '2':  65298, // '２'
  '3':  65299, // '３'
  '4':  65300, // '４'
  '5':  65301, // '５'
  '6':  65302, // '６'
  '7':  65303, // '７'
  '8':  65304, // '８'
  '9':  65305, // '９'
  ' ':   8193, //  '
  '!':  65281, // '！'
  '"':  65282, // '＂'
  '#':  65283, // '＃'
  '$':  65284, // '＄'
  '%':  65285, // '％'
  '&':  65286, // '＆'
  '\'': 65287, // '＇'
  '(':  65288, // '（'
  ')':  65289, // '）'
  '*':  65290, // '＊'
  '+':  65291, // '＋'
  ',':  65292, // '，'
  '-':  65293, // '－'
  '.':  65294, // '．'
  '/':  65295, // '／'
  ':':  65306, // '：'
  ';':  65307, // '；'
  '<':  65308, // '＜'
  '=':  65309, // '＝'
  '>':  65310, // '＞'
  '?':  65311, // '？'
  '@':  65312, // '＠'
  'A':  65313, // 'Ａ'
  'B':  65314, // 'Ｂ'
  'C':  65315, // 'Ｃ'
  'D':  65316, // 'Ｄ'
  'E':  65317, // 'Ｅ'
  'F':  65318, // 'Ｆ'
  'G':  65319, // 'Ｇ'
  'H':  65320, // 'Ｈ'
  'I':  65321, // 'Ｉ'
  'J':  65322, // 'Ｊ'
  'K':  65323, // 'Ｋ'
  'L':  65324, // 'Ｌ'
  'M':  65325, // 'Ｍ'
  'N':  65326, // 'Ｎ'
  'O':  65327, // 'Ｏ'
  'P':  65328, // 'Ｐ'
  'Q':  65329, // 'Ｑ'
  'R':  65330, // 'Ｒ'
  'S':  65331, // 'Ｓ'
  'T':  65332, // 'Ｔ'
  'U':  65333, // 'Ｕ'
  'V':  65334, // 'Ｖ'
  'W':  65335, // 'Ｗ'
  'X':  65336, // 'Ｘ'
  'Y':  65337, // 'Ｙ'
  'Z':  65338, // 'Ｚ'
  '[':  65339, // '［'
  '\\': 65340, //  '＼'
  ']':  65341, // '］'
  '^':  65342, // '＾'
  '_':  65343, // '＿'
  '`':  65344, // '｀'
  'a':  65345, // 'ａ'
  'b':  65346, // 'ｂ'
  'c':  65347, // 'ｃ'
  'd':  65348, // 'ｄ'
  'e':  65349, // 'ｅ'
  'f':  65350, // 'ｆ'
  'g':  65351, // 'ｇ'
  'h':  65352, // 'ｈ'
  'i':  65353, // 'ｉ'
  'j':  65354, // 'ｊ'
  'k':  65355, // 'ｋ'
  'l':  65356, // 'ｌ'
  'm':  65357, // 'ｍ'
  'n':  65358, // 'ｎ'
  'o':  65359, // 'ｏ'
  'p':  65360, // 'ｐ'
  'q':  65361, // 'ｑ'
  'r':  65362, // 'ｒ'
  's':  65363, // 'ｓ'
  't':  65364, // 'ｔ'
  'u':  65365, // 'ｕ'
  'v':  65366, // 'ｖ'
  'w':  65367, // 'ｗ'
  'x':  65368, // 'ｘ'
  'y':  65369, // 'ｙ'
  'z':  65370, // 'ｚ'
  '{':  65371, // '｛'
  '|':  65372, // '｜'
  '}':  65373, // '｝'
  '~':  65374, // '～'
};

export const prettyPrintParentheses = (text) => {
  let level = 0;
  let output = '';
  for (let i = 0; i < text.length; ++i) {
    let prev = text[i - 1];
    let ch = text[i];
    let next = text[i + 1];
    if (ch === '(' && next !== ')') {
      ++level;
      output += ch + '\n' + ' '.repeat(level);
    } else if (ch === ')' && prev !== '(') {
      --level;
      output += '\n' + ' '.repeat(level) + ch + '\n' + ' '.repeat(level);
    } else {
      output += ch;
    }
  }
  return output;
};

export const applyToEachLine = (regex, out, text) =>
  text.split('\n').map(l => l.replace(regex, out)).join('\n');

export const textToWrappedLinesDoubleQuoted = (text) => {
  return '' +
    '[\n' + text
      .split('\n')
      //			.filter(l => l !== '')
      // TODO: escape properly. for now i don't handle when string is already escaped
      .map(l => l.replace(/\$/g, '\\$'))
      .map(l => l.replace(/"/g, '\\"'))
      .map(l => '    "' + l + '",')
      .join('\n') +
    '\n].join("\\n")';
};

export const textToWrappedLinesSingleQuoted = (text) => {
  text = text.replace(/\n$/, '');
  return '' +
    '[\n' + text
      .split('\n')
      //			.filter(l => l !== '')
      // TODO: escape properly. for now i don't handle when string is already escaped
      .map(l => l.replace(/'/g, "\\'"))
      .map(l => "    '" + l + "',")
      .join('\n') +
    '\n].join(\'\\n\')';
};

export const parseJs = (jsCode) => {
  try {
    return eval('(' + jsCode + ')');
  } catch (syntaxError) {
    let lines = jsCode.split('\n').filter(l => l.trim());
    if (lines.length > 0) {
      // try to parse as json object lines, our fluent logger
      return lines.map(l => JSON.parse(l));
    } else {
      throw syntaxError;
    }
  }
};

export const parseHttpQuery = query => {
  let result = {};
  for (let entry of query.split('&')) {
    let [k,v] = entry.split('=');
    k = decodeURIComponent(k);
    v = decodeURIComponent(v.replace(/\+/g, '%20'));
    let [_, varName, hasSub, subKeyStr] = k.match(/^(.+?)(?:(\[)(.*)\]|)$/);
    let keys = hasSub ? subKeyStr.split('][') : [];
    keys.unshift(varName);
    let destination = result;
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      let next = keys[i + 1];
      let def = next === '' ? [] : {};
      if (key === '') {
        // array
        key = destination.length;
        destination.push(def);
      } else {
        // object key
        destination[key] = destination[key] || def;
      }
      if (next === '') {
        destination = destination[key];
      } else if (next) {
        destination = destination[key];
      } else {
        // nah, too lazy to understand, better just JSON.stringify
        destination[key] = !destination[key] || JSON.stringify(destination[key]) === '{}' ? v :
          Array.isArray(destination[key])
            ? destination[key].concat([v])
            : [destination[key], v];
      }
    }
  }
  return result;
};