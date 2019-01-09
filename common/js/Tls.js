
var Tls = function()
{
    var $$ = s => [...document.querySelectorAll(s)];

    let ajaxText = function(url, restMethod, params, whenLoaded, onProgress) {
        "use strict";
        onProgress = onProgress || (chunk => {});

        var esc = encodeURIComponent;
        url += restMethod.toUpperCase() === 'GET'
            ? '?' + Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&')
            : '';

        var oReq = new XMLHttpRequest();

        oReq.open(restMethod, url, true);
        oReq.responseType = 'text';
        oReq.withCredentials = true;

        oReq.onload = () => whenLoaded(oReq.response);
        oReq.onprogress = () => onProgress(oReq.response);
        oReq.send(JSON.stringify(params));
    };

    let ajax = function(url, restMethod, params, whenLoaded, onProgressData, onProgressInfo) {
        "use strict";
        var lastLineCount = 0;
        var dataParts = [];
        onProgressData = onProgressData || (e => {});
        onProgressInfo = onProgressInfo || ((msg, data) => console.log(msg, data));

        var performOnProgress = (downloaded) => {
            var lines = downloaded.split('\n');
            var last = lines.splice(-1)[0];
            if (lastLineCount !== lines.length && last === '') {
                lines.slice(lastLineCount).forEach(resp => {
                    try {
                        resp = JSON.parse(resp);
                        if (resp.info) {
                            onProgressInfo(resp.info, resp.infoData);
                        } else {
                            dataParts.push(resp.data);
                            onProgressData(resp.data);
                        }
                    } catch (e) {
                        console.log('failed to parse response', resp);
                    }
                });
                lastLineCount = lines.length;
            }
        };

        ajaxText(url, restMethod, params, (downloaded) => {
            performOnProgress(downloaded);
            whenLoaded(dataParts);
        }, performOnProgress)
    };

    let urlRoot = 'https://midiana.lv/entry/dev_data';

    let callExternal = function(funcName, funcParams, cb) {
        "use strict";
        ajax(urlRoot + '/common/php/service.php', 'POST', {
            f: funcName,
            w: Tls.opt($$('select.working-copy')[0]).map(dom => dom.value).def('rbs-dev'),
            p: funcParams,
        }, respParts => {
            var resp = respParts[0];
            var [error, result] = resp;
            if (!error) {

                cb(result);
            } else {
                console.log('Error!', error);
                alert('Error! ' + error);
            }
        });
    };

    let jsExport = function($var, $margin, inlineLimit) {
        "use strict";
        var ind = '    ';
        $margin = $margin || '';
        inlineLimit = inlineLimit || 64;

        if ($var === undefined) {
            return 'undefined';
        }

        return JSON.stringify($var).length < inlineLimit ? JSON.stringify($var)
            : Array.isArray($var)
                ? '[\n'
                    + $var.map((el) => $margin + ind + jsExport(el, $margin + ind, inlineLimit)).join(',\n')
                    + '\n' + $margin + ']'
            : (typeof $var === 'object' && $var !== null)
                ? '{\n'
                    + Object.keys($var).map(k => $margin + ind + JSON.stringify(k) + ': ' + jsExport($var[k], $margin + ind, inlineLimit)).join(',\n')
                    + '\n' + $margin + '}'
            : (typeof $var === 'string' && $var.indexOf('\n') > -1)
                ? jsExport($var.split('\n'), $margin) + '.join("\\n")'
            : JSON.stringify($var);
    };

    let addSlashes = (str) => str
        .replace(/[\\']/g, '\\$&')
        .replace(/\u0000/g, '\\0');

    let varImport = function(inputText) {
        let result = {then: (parsed) => {}};
        Tls.callExternal('varImport', inputText, parsed => {
            return result.then(parsed);
        });
        return result;
    };

    let xmlToArr = function(inputText) {
        let result = {then: (parsed) => {}};
        Tls.callExternal('xmlToArr', inputText, parsed => {
            return result.then(parsed);
        });
        return result;
    };

    let varExport = function($var, $margin, ind = '    ', inlineLimit) {
        $margin = $margin || '';
        inlineLimit = inlineLimit || 64;

        if ($var === undefined) {
            return 'undefined';
        }

        let $result = Array.isArray($var)
                ? '[' + (ind ? '\n' : '')
                    + $var.map((el) => $margin + ind + varExport(el, $margin + ind, ind, inlineLimit))
                        .join(ind ? ',\n' : ',')
                    + (ind && $var.length > 0 ? ',\n' : '') + $margin + ']'
            : (typeof $var === 'object' && $var !== null)
                ? '[' + (ind ? '\n' : '')
                    + Object.keys($var)
                        .map(k => $margin + ind + '\'' + addSlashes(k) + '\'' +
                            ' => ' + varExport($var[k], $margin + ind, ind, inlineLimit))
                        .join(ind ? ',\n' : ',')
                    + (ind ? ',\n' : '') + $margin + ']'
            : (typeof $var === 'string' && $var.indexOf('\n') > -1)
                ? 'implode(PHP_EOL, ' + varExport($var.split('\n'), $margin, ind, inlineLimit) + ')'
            : (typeof $var === 'string')
                ? '\'' + addSlashes($var) + '\''
            : JSON.stringify($var);

        if (ind && $result.length < 5000) { // performance hack
            let $minified = varExport($var, '', '', inlineLimit);
            if ($minified.length < inlineLimit) {
                $result = $minified;
            }
        }

        return $result;
    };

    let prettifyXml = function(sourceXml)
    {
        var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
        var xsltDoc = new DOMParser().parseFromString([
            // describes how we want to modify the XML - indent everything
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:strip-space elements="*"/>',
            '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
            '    <xsl:value-of select="normalize-space(.)"/>',
            '  </xsl:template>',
            '  <xsl:template match="node()|@*">',
            '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '  </xsl:template>',
            '  <xsl:output indent="yes"/>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        var resultXml = new XMLSerializer().serializeToString(resultDoc);
        return resultXml;
    };

    let promise = function (giveMemento) {
        let done = false;
        let result;
        let thens = [];
        giveMemento(r => {
            done = true;
            result = r;
            thens.forEach((cb) => cb(result));
        });
        let self = {
            set then(receive) {
                if (done) {
                    receive(result);
                }
                else {
                    thens.push(receive);
                }
            },
            map: (f) => promise(delayedReturn => self.then =
                (r) => delayedReturn(f(r))),
            now: () => exports.S.opt(result, done),
        };
        return self;
    };

    let opt = function (value, forceIsPresent = false) {
        let has = () => forceIsPresent ||
        value !== null && value !== undefined;
        let self;
        return self = {
            map: (f) => has()
                ? opt(f(value))
                : opt(null),
            flt: (f) => has() && f(value)
                ? opt(value)
                : opt(null),
            saf: (f) => {
                if (has()) {
                    try {
                        return opt(f(value));
                    }
                    catch (exc) {
                        console.error('Opt mapping threw an exception', exc);
                    }
                }
                return opt(null);
            },
            def: (def) => has()
                ? value
                : def,
            has: has,
            set get(cb) {
                if (has()) {
                    cb(value);
                }
            },
            wth: (f) => {
                if (has())
                    f(value);
                return self;
            },
            uni: (some, none) => has()
                ? some(value)
                : none(),
            err: (none) => {
                if (has()) {
                    return {
                        set els(some) { some(value); },
                    };
                }
                else {
                    none();
                    return {
                        set els(some) { },
                    };
                }
            },
        };
    };

    return {
        ajax: ajax,
        ajaxText: ajaxText,
        callExternal: callExternal,
        jsExport: jsExport,
        prettifyXml: prettifyXml,
        varExport: varExport,
        varImport: varImport,
        xmlToArr: xmlToArr,
        promise: promise,
        opt: opt,
    };
}();


