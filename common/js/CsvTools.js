

export const parseCsvTabs = (dump) => {
    let lines = dump.split('\n');
    let headers = lines.shift().split('\t');
    let result = lines.filter(l => l).map(line => {
        let row = {};
        let values = line.split('\t').map(v => v.replace(/\\n/g, '\n'));
        for (let i = 0; i < headers.length; ++i) {
            row[headers[i]] = values[i];
        }
        return row;
    });
    console.log(result);
    return result;
};

const pad = (n, width, z, right = false) => {
    z = z || '0';
    n = n + '';
    let space = new Array(width - n.length + 1).join(z);
    return n.length >= width ? n : right ? space + n : n + space;
};

export const jsonToCsv = (jsonText, phpFormat = false) => {
    let rows = eval(jsonText);
    let valueBundles = [];
    let quote = phpFormat
        ? (val) => Tls.varExport(val, '', '')
        : (val) => JSON.stringify(val);
    let keys = [...new Set(rows.flatMap(r => Object.keys(r)))];
    valueBundles.push(keys.map(v => quote(v)));
    valueBundles = valueBundles.concat(rows.map(row => keys.map(k => row[k] === undefined ? null : row[k]).map(v => quote(v))));

    let colNumToMinLen = [];
    for (let values of valueBundles) {
        for (let i = 0; i < values.length; ++i) {
            colNumToMinLen[i] = colNumToMinLen[i] || 0;
            colNumToMinLen[i] = Math.max(colNumToMinLen[i], values[i].length);
        }
    }
    for (let values of valueBundles) {
        for (let i = 0; i < values.length; ++i) {
            let right = (values[i] + '').match(/^\d+|'\d+'$/);
            values[i] = pad(values[i], colNumToMinLen[i], ' ', right);
        }
    }
    let csv = valueBundles
        .map(vals => vals.join(' , '))
        .map(line => phpFormat ? '    [' + line + '],' : line)
        .join('\n');
    csv = !phpFormat ? csv : 'ArrayUtil::makeTableRows([\n' + csv + '\n])';
    return csv;
};

export const csvToJson = (csvText, delimiter) => {
    let lines = csvText.trim().split('\n');
    let cols = lines.shift().split(delimiter);
    let rows = lines.map(line => {
        let row = {};
        let vals = line.split(delimiter);
        for (let i = 0; i < cols.length; ++i) {
            let col = cols[i];
            let val = vals[i];
            row[col] = val;
        }
        return row;
    });
    return Tls.jsExport(rows);
};