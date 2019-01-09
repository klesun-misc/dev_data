
/**
 * parses output of var_export() since eval() is bad
 */
class VarExportParser
{
    constructor($text) {
        this.$text = $text;
        this.$whitespace = [" ", "\t", "\n", "\r"];
        this.$offset = 0;
    }

    error($msg) {
        let $parsedText = this.$text.slice(0, this.$offset);
        let $parsedLines = $parsedText.split('\n');
        let $lineNumber = $parsedLines.length - 1;
        let $columnNumber = $parsedLines[$parsedLines.length - 1].length - 1;
        return new Error('Unexpected token(' + $lineNumber + ',' + $columnNumber + '): ' + '[' + (this.$text[this.$offset] || 'EOF') + ']: ' + $msg);
    }

    isDigit($char) {
        let $asciiNum = $char.charCodeAt(0);
        return $asciiNum >= '0'.charCodeAt(0) && $asciiNum <= '9'.charCodeAt(0);
    }

    parseNumber() {
        let $dotOccurred = false;
        let $i = this.$offset;
        for (; $i < this.$text.length; ++$i) {
            let $char = this.$text[$i];
            if (!this.isDigit($char)) {
                if ($char !== '.' || $dotOccurred++) {
                    break;
                }
            }
        }
        let $result = +this.$text.slice(this.$offset, $i - this.$offset);
        this.$offset = $i;
        return $result;
    }

    parseString($quoteKind) {
        let $escapeNext = false;
        let $quotedText = '';
        for (let $i = this.$offset; $i < this.$text.length; ++$i) {
            let $char = this.$text[$i];
            if ($escapeNext) {
                $quotedText += $char;
                $escapeNext = false;
            } else if ($char === '\\\\') {
                $escapeNext = true;
            } else if ($char === $quoteKind) {
                this.$offset = $i + 1;
                return $quotedText;
            } else {
                $quotedText += $char;
            }
        }
        throw this.error('Text ends with unclosed string');
    }

    unprefix($prefix, $mustMatch) {
        if (this.$text.indexOf($prefix, this.$offset) === this.$offset) {
            this.$offset += $prefix.length;
            return true;
        } else if ($mustMatch) {
            throw this.error('Expected [' + $prefix + ']');
        } else {
            return false;
        }
    }

    /** @param $prefixReg should always start with ^ */
    unprefixReg($prefixReg, $mustMatch) {
		let match = this.$text.slice(this.$offset).match($prefixReg);
        if (match && match.index === this.$offset) {
            this.$offset += match[0].length;
            return true;
        } else if ($mustMatch) {
            throw this.error('Expected ' + $prefixReg);
        } else {
            return false;
        }
    }

    skipLineComment() {
        for (let $i = this.$offset; $i < this.$text.length; ++$i) {
            let $char = this.$text[$i];
            if ($char === "\n" || $i === this.$text.length - 1) {
                this.$offset = $i + 1;
                break;
            }
        }
        this.skipWhiteSpace();
    }

    skipWhiteSpace() {
        for (let $i = this.$offset; $i < this.$text.length; ++$i) {
            let $char = this.$text[$i];
            if (!this.$whitespace.includes($char)) {
                this.$offset = $i;
                break;
            }
        }
        if (this.unprefix('\/\/')) {
            this.skipLineComment();
        }
    }

    parsePhpArray(closingBracket = ']') {
        let $arrResult = [];
        let $objResult = {};
        this.skipWhiteSpace();
        let $tuple;
        while ($tuple = this.parseValue(false)) {
            let [$lValue] = $tuple;
            this.skipWhiteSpace();

            if ((typeof $lValue === 'string') && this.unprefix('=>')) {
                this.skipWhiteSpace();
                let [$rValue] = this.parseValue(true);
                $objResult[$lValue] = $rValue;
            } else {
                $arrResult.push($lValue);
            }
            this.skipWhiteSpace();

            if (this.unprefix(',')) {
                this.skipWhiteSpace();
            } else {
                break;
            }
        }
        this.unprefix(closingBracket, true);
        return Object.keys($objResult).length > 0
            ? Object.assign($objResult, $arrResult)
            : $arrResult;
    }

    /**
     * @return array - [$value] on success, [] on fail
     */
    parseValue($mustMatch) {
        let $parsed;
        if (this.unprefix('\'')) {
            $parsed = [this.parseString('\'')];
        } else if (this.unprefix('"')) {
            $parsed = [this.parseString('"')];
        } else if (this.unprefix('[')) {
            $parsed = [this.parsePhpArray()];
        } else if (this.unprefixReg(/^array\s*\(/)) {
            $parsed = [this.parsePhpArray(')')];
        } else if (this.unprefix('null')) {
            $parsed = [null];
        } else if (this.unprefix('false')) {
            $parsed = [false];
        } else if (this.unprefix('true')) {
            $parsed = [true];
        } else if (this.unprefix('PHP_EOL')) {
            $parsed = ['\n'];
        } else if (this.isDigit(this.$text[this.$offset] || '')) {
            $parsed = [this.parseNumber()];
        } else if (this.unprefix('implode(PHP_EOL, [')) {
            let $lines = this.parsePhpArray();
            this.unprefix(')', true);
            $parsed = [$lines.join('\n')];
        } else {
            if ($mustMatch) {
                throw this.error('Expected: value');
            } else {
                let $parsed = [];
            }
        }
        this.skipWhiteSpace();
        if (this.unprefix('.')) {
            this.skipWhiteSpace();
            let $cctValue = this.parseValue(true);
            if ($cctValue && (typeof $parsed[0] === 'string') && (typeof $cctValue[0] === 'string')) {
                $parsed[0] += $cctValue[0];
            } else {
                throw this.error('Invalid concatenation values ' + JSON.stringify($parsed) + ' - ' + JSON.stringify($cctValue));
            }
        }
        return $parsed;
    }

    /**
     * @throws \Exception on unexpected token
     */
    static parse($text) {
        let $self = new VarExportParser($text);
        let [$value] = $self.parseValue(true);
        return $value;
    }
}
