<?php
/**
 * <root><a>5</a><b>6</b><b>8</b></root> -> {"root":[{"a":["5"],"b":["6","8"]}]}
 * <root a="5"><b>6</b><b>8</b></root> -> {"root":[{"a":"5","b":["6","8"]}]}
 * <root xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"><a>123</a><wsp:b>456</wsp:b></root>
 *   -> {"root":[{"xmlns:wsp":"http://schemas.xmlsoap.org/ws/2004/09/policy","a":["123"],"wsp:b":["456"]}]}
 */
function domNodesToArray(array $tags, \DOMXPath $xpath)
{
    $tagNameToArr = [];
    foreach ($tags as $tag) {
        $tagData = [];
        $attrs = $tag->attributes ? iterator_to_array($tag->attributes) : [];
        $subTags = $tag->childNodes ? iterator_to_array($tag->childNodes) : [];
        foreach ($xpath->query('namespace::*', $tag) as $nsNode) {
            // the only way to get xmlns:*, see https://stackoverflow.com/a/2470433/2750743
            if ($tag->hasAttribute($nsNode->nodeName)) {
                $attrs[] = $nsNode;
            }
        }

        foreach ($attrs as $attr) {
            $tagData[$attr->nodeName] = $attr->nodeValue;
        }
        if (count($subTags) === 1 && $subTags[0] instanceof \DOMText) {
            $text = $subTags[0]->nodeValue;
        } elseif (count($subTags) === 0) {
            $text = '';
        } else {
            // ignore whitespace (and any other text if any) between nodes
            $isNotDomText = function($node){return !($node instanceof \DOMText);};
            $realNodes = array_filter($subTags, $isNotDomText);
            $subTagNameToArr = domNodesToArray($realNodes, $xpath);
            $tagData = array_merge($tagData, $subTagNameToArr);
            $text = null;
        }
        if (!is_null($text)) {
            if ($attrs) {
                if ($text) {
                    $tagData['_'] = $text;
                }
            } else {
                $tagData = $text;
            }
        }
        $keyName = $tag->nodeName;
        $tagNameToArr[$keyName][] = $tagData;
    }
    return $tagNameToArr;
}

function xmlToArr(string $xml)
{
    $doc = new \DOMDocument();
    $doc->loadXML($xml);
    $xpath = new \DOMXPath($doc);
    $tags = $doc->childNodes ? iterator_to_array($doc->childNodes) : [];
    return domNodesToArray($tags, $xpath);
}
