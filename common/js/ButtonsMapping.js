
import {parsePrintRValue, printRExample, varExportExample} from "./PhpTools.js";
import {parseSqlSelectG, someSqlSelect, someSqlSelectG, sqlSelectToJson} from "./SqlTools.js";
import {csvToJson, jsonToCsv, parseCsvTabs} from "./CsvTools.js";
import {
  applyToEachLine,
  fixedWidthCharMapping, parseHttpQuery, parseJs,
  prettyPrintParentheses,
  someMultilineText,
  someWrappingMultiLineCode, textToWrappedLinesDoubleQuoted, textToWrappedLinesSingleQuoted
} from "./Misc.js";


const $$ = s => [...document.querySelectorAll(s)];

const getInlineLimit = () => $$('.var-export-inline-limit')[0].value;

export default [
  {
    name: 'http query to json',
    implementation: query => Tls.jsExport(parseHttpQuery(query), null, getInlineLimit()),
    sample: 'rId=7488984&flightOptionId=30309597&apolloPcc=1&currency=1&customerRemarks=&internalRemarks=&msg=++2++HF3513+B+22DEC+6+EWRABJ+TK1++1155P+240P+23DEC++E++HF%2FPP2QJI%0D%0A++3++HF+532+B+23DEC+7+ABJLOS+HK1+++100P+400P+23DEC++E++HF%2FPP2QJI%0D%0A++4++ET1421+T+21JAN+1+LOSABJ+HK1++1010A1050A+21JAN++E++ET%2FMHNMVE%0D%0A++5++HF3512+V+21JAN+1+ABJEWR+TK1+++215P+900P+21JAN++E++HF%2FPP2QJI%0D%0A&passengers%5B%5D=105464471&quote%5Bexchange%5D=on&exchange%5Badult%5D%5BairlinePenalty%5D=250&exchange%5Badult%5D%5BnoShowFee%5D=&exchange%5Badult%5D%5BitnProcessingFee%5D=250&exchange%5Badult%5D%5BfareDiff%5D=0&quote%5Brefund%5D=on&refund%5Badult%5D%5BticketPrice%5D=0&refund%5Badult%5D%5BairlinePenalty%5D=250&refund%5Badult%5D%5BnoShowFee%5D=&refund%5Badult%5D%5BitnProcessingFee%5D=250&refund%5Badult%5D%5BrecalledCommissions%5D=0&refund%5Badult%5D%5BnonRefundableServiceFee%5D=&csDraftId=undefined',
    language: 'ace/mode/javascript',
  },
  {
    name: 'Prettify json',
    implementation: jsCode => Tls.jsExport(parseJs(jsCode), null, getInlineLimit()),
    sample: '["aaa", "bbb", "ccc"].join("\\n")',
    language: 'ace/mode/javascript',
  },
  {
    name: 'Prettify XML',
    implementation: inlineXml => Tls.prettifyXml(inlineXml),
    sample: '["aaa", "bbb", "ccc"].join("\\n")',
    language: 'ace/mode/html',
  },
  // php stuff
  {
    name: 'var_export to json',
    implementation: phpCode => Tls.jsExport(VarExportParser.parse(phpCode), null, getInlineLimit()),
    sample: varExportExample,
    language: 'ace/mode/javascript',
  },
  {
    name: 'json to var_export',
    implementation: jsCode => Tls.varExport(parseJs(jsCode), null, '    ', getInlineLimit()),
    sample: '["aaa", "bbb", "ccc"].join("\\n")',
    language: 'ace/mode/php',
  },
  {
    name: 'print_r parser',
    implementation: printRText => {
      let parsed = parsePrintRValue(printRText);
      return Tls.jsExport(parsed, null, getInlineLimit());
    },
    sample: printRExample,
    language: 'ace/mode/javascript',
  },
  // SQL stuff
  {
    name: 'SQL select -> JSON',
    implementation: sqlSelectToJson,
    sample: someSqlSelect,
    language: 'ace/mode/javascript',
  },
  {
    name: 'SQL \\G to var_export',
    implementation: text => Tls.varExport(parseSqlSelectG(text), null, '    ', getInlineLimit()),
    sample: someSqlSelectG,
    language: 'ace/mode/php',
  },
  {
    name: 'SQL tabs to var_export',
    implementation: csvTabs => Tls.varExport(parseCsvTabs(csvTabs), null, '    ', getInlineLimit()),
    sample: '',
    language: 'ace/mode/php',
  },
  {
    name: 'To CSV',
    implementation: jsonText => jsonToCsv(jsonText),
    sample: '',
    language: 'ace/mode/javascript',
  },
  {
    name: 'From CSV (Tab)',
    implementation: csvText => csvToJson(csvText, '\t'),
    sample: '',
    language: 'ace/mode/javascript',
  },
  {
    name: 'To JSON CSV',
    implementation: jsonText => jsonToCsv(jsonText, true),
    sample: '',
    language: 'ace/mode/php',
  },
  {
    name: 'To fixed width unicode',
    implementation: text => {
      let result = '';
      // if you specify them in string literals, these characters get replaced
      // with gibberish, possibly because they are in a <script/> tag
      let mapping = fixedWidthCharMapping;
      for (let i = 0; i < text.length; ++i) {
        let char = text[i];
        if (char in mapping) {
          result += String.fromCharCode(mapping[char]);
        } else {
          result += char;
        }
      }
      return result;
    },
    sample: '',
    language: 'ace/mode/php',
  },
  {
    name: 'Text -> [...].join(\\n) (")',
    implementation: textToWrappedLinesDoubleQuoted,
    sample: someMultilineText,
    language: 'ace/mode/php',
  },
  {
    name: "Text -> [...].join(\\n) (')",
    implementation: textToWrappedLinesSingleQuoted,
    sample: someMultilineText,
    language: 'ace/mode/php',
  },
  {
    name: '<- Undo',
    implementation: wrappingCode =>
      applyToEachLine(/^( *)'(.*?)'[,\.;].*$/, '$1$2', wrappingCode),
    sample: someWrappingMultiLineCode,
    language: 'ace/mode/plain_text',
  },
  // misc
  {
    name: 'Pretty-Print Parentheses',
    implementation: jsonText => prettyPrintParentheses(jsonText),
    sample: '',
    language: 'ace/mode/plain_text',
  },
  {
    name: 'Put to "currentData" variable',
    implementation: jsCode => {
      window.currentData = parseJs(jsCode);
      return jsCode;
    },
    sample: '{a:5,b:6}',
    language: 'ace/mode/javascript',
  },
  {
    name: 'Put to "currentData" variable from clipboard',
    implementation: () => {
      navigator.clipboard.readText()
        .then(text => {
          window.currentData = text;
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
    },
    language: 'ace/mode/javascript',
  },
];