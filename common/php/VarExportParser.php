<?php

/**
 * parses output of var_export() since eval() is bad
 */
class VarExportParser
{
    private static $whitespace = [" ", "\t", "\n", "\r"];

    private $text;
    private $offset = 0;

    private function __construct(string $text)
    {
        $this->text = $text;
    }

    private function error(string $msg): \Exception
    {
        $parsedText = substr($this->text, 0, $this->offset);
        $parsedLines = explode(PHP_EOL, $parsedText);
        $lineNumber = count($parsedLines) - 1;
        $columnNumber = strlen($parsedLines[count($parsedLines) - 1]) - 1;
        return new \Exception('Unexpected token('.$lineNumber.','.$columnNumber.'): '.
            '['.($this->text[$this->offset] ?? 'EOF').']: '.$msg);
    }

    private static function isDigit(string $char)
    {
        $asciiNum = ord($char);
        return $asciiNum >= ord('0') && $asciiNum <= ord('9');
    }

    private function parseNumber()
    {
        $dotOccurred = false;

        $i = $this->offset;
        for (; $i < strlen($this->text); ++$i) {
            $char = $this->text[$i];
            if (!self::isDigit($char)) {
                if ($char !== '.' || $dotOccurred++) {
                    break;
                }
            }
        }

        $result = +substr($this->text, $this->offset, $i - $this->offset);
        $this->offset = $i;
        return $result;
    }

    private function parseString(string $quoteKind)
    {
        $escapeNext = false;
        $quotedText = '';

        for ($i = $this->offset; $i < strlen($this->text); ++$i) {
            $char = $this->text[$i];
            if ($escapeNext) {
                $quotedText .= $char;
                $escapeNext = false;
            } elseif ($char === '\\') {
                $escapeNext = true;
            } elseif ($char === $quoteKind) {
                $this->offset = $i + 1;
                return $quotedText;
            } else {
                $quotedText .= $char;
            }
        }

        throw $this->error('Text ends with unclosed string');
    }

    private function unprefix(string $prefix, bool $mustMatch = false): bool
    {
        if (strpos($this->text, $prefix, $this->offset) === $this->offset) {
            $this->offset += strlen($prefix);
            return true;
        } elseif ($mustMatch) {
            throw $this->error('Expected ['.$prefix.']');
        } else {
            return false;
        }
    }

    /** @param string $prefixReg should always start with ^ */
    private function unprefixReg(string $prefixReg, bool $mustMatch = false) {
		$doesMatch = preg_match($prefixReg, substr($this->text, $this->offset), $matches);
        if ($doesMatch) {
            $this->offset += strlen($matches[0]);
            return true;
        } else if ($mustMatch) {
            throw $this->error('Expected '.$prefixReg);
        } else {
            return false;
        }
    }

    private function skipLineComment()
    {
        for ($i = $this->offset; $i < strlen($this->text); ++$i) {
            $char = $this->text[$i];
            if ($char === PHP_EOL || $i === strlen($this->text) - 1) {
                $this->offset = $i + 1;
                break;
            }
        }
        $this->skipWhiteSpace();
    }

    private function skipWhiteSpace()
    {
        for ($i = $this->offset; $i < strlen($this->text); ++$i) {
            $char = $this->text[$i];
            if (!in_array($char, self::$whitespace)) {
                $this->offset = $i;
                break;
            }
        }
        if ($this->unprefix('//')) {
            $this->skipLineComment();
        }
    }

    private function parsePhpArray($closingBracket = ']')
    {
        $result = [];

        $this->skipWhiteSpace();

        while ($tuple = $this->parseValue(false)) {
            list($lValue) = $tuple;
            $this->skipWhiteSpace();

            if (is_string($lValue) && $this->unprefix('=>')) {
                $this->skipWhiteSpace();
                list($rValue) = $this->parseValue(true);
                $result[$lValue] = $rValue;
            } else {
                $result[] = $lValue;
            }
            $this->skipWhiteSpace();

            if ($this->unprefix(',')) {
                $this->skipWhiteSpace();
            } else {
                break;
            }
        }

        $this->unprefix($closingBracket, true);
        return $result;
    }

    /**
     * @return array - [$value] on success, [] on fail
     */
    private function parseValue(bool $mustMatch)
    {
        if ($this->unprefix('\'')) {
            $parsed = [$this->parseString('\'')];
        } elseif ($this->unprefix('"')) {
            $parsed = [$this->parseString('"')];
        } elseif ($this->unprefix('[')) {
            $parsed = [$this->parsePhpArray()];
        } elseif ($this->unprefix('null')) {
            $parsed = [null];
        } elseif ($this->unprefix('false')) {
            $parsed = [false];
        } elseif ($this->unprefix('true')) {
            $parsed = [true];
        } elseif ($this->unprefix('PHP_EOL')) {
            $parsed = [PHP_EOL];
        } elseif (self::isDigit($this->text[$this->offset] ?? '')) {
            $parsed = [self::parseNumber()];
        } elseif ($this->unprefix('implode(PHP_EOL, [')) {
            $lines = $this->parsePhpArray();
            $this->unprefix(')', true);
        } elseif ($this->unprefixReg('/^array\s*\(/')) {
            $parsed = [$this->parsePhpArray(')')];
            $parsed = [implode(PHP_EOL, $lines)];
        } else {
            if ($mustMatch) {
                throw $this->error('Expected: value');
            } else {
                $parsed = [];
            }
        }

        $this->skipWhiteSpace();
        if ($this->unprefix('.')) {
            $this->skipWhiteSpace();
            $cctValue = $this->parseValue(true);
            if ($cctValue && is_string($parsed[0]) && is_string($cctValue[0])) {
                $parsed[0] .= $cctValue[0];
            } else {
                throw $this->error('Invalid concatenation values '.json_encode($parsed).' - '.json_encode($cctValue));
            }
        }

        return $parsed;
    }

    /**
     * @throws \Exception on unexpected token
     */
    public static function parse(string $text)
    {
        $self = new self($text);
        list($value) = $self->parseValue(true);
        return $value;
    }
}

