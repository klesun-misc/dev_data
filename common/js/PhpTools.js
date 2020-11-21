


/**
 * this function is very slow on large data sets (~20 seconds on 4MiB of text),
 * could use some optimization, especially around firstSquare var definition
 */
export const parsePrintRValue = (printRText) => {
    printRText = printRText.trimLeft();
    let arrayMatch = printRText.match(/^Array\s+\((.*)/s);
    if (arrayMatch) {
        printRText = arrayMatch[1];
        printRText = printRText.trimLeft();
        let assocArr = {};
        while (printRText.length > 0) {
            let match = printRText.match(/^\[([a-zA-Z0-9_]+)] =>[ ]?/);
            if (match) {
                let [full, key] = match;
                let parsed = parsePrintRValue(printRText.slice(full.length));
                assocArr[key] = parsed.value;
                printRText = parsed.textLeft.trimLeft();
            } else if (printRText.startsWith(')')) {
                // end of array
                return {value: assocArr, textLeft: printRText.slice(1)};
            } else {
                return {value: 'Unexpected start of array key - ' + printRText.slice(0, 200), textLeft: ''};
            }
        }
        return {value: printRText, textLeft: ''};
    } else {
        let firstParen = findClosingParen(printRText);
        let nextKeyMatch = printRText.match(/\[([a-zA-Z0-9_]+)] =>/s);
        let firstSquare = !nextKeyMatch ? -1 : nextKeyMatch.index;
        let terminators = [];
        if (firstParen > -1) {
            terminators.push(firstParen);
        }
        if (firstSquare > -1) {
            terminators.push(firstSquare);
        }
        let terminatedAt = terminators.length > 0
            ? Math.min(...terminators) : printRText.length;
        let value = printRText.slice(0, Math.max(terminatedAt - 1, 0)).trimRight();
        let textLeft = printRText.slice(terminatedAt);
        return {
            value: value,
            textLeft: textLeft,
        };
    }
};

export let printRExample = [
    'Array ( ',
    '                            [segmentNumber] => 1',
    '                            [airline] => UA ',
    '                            [flightNumber] => 934',
    '                            [bookingClass] => L',
    '                            [departureDate] => Array (',
    '                                [parsed] => 09-15',
    '                            )',
    '                                [departureTime] => Array (',
    '                                    [parsed] => 08:30',
    '                                )',
    '                                    [departureAirport] => EWR',
    '                                    [destinationAirport] => LHR',
    '                                    [segmentStatus] => SS',
    '                                    [seatCount] => 1',
    '                                    [dayOffset] => 0',
    '                                    [eticket] => 1',
    '                                    [daysOfWeek] => 6',
    '                                    [destinationTime] => Array (',
    '                                        [parsed] => 20:40 ',
    '                                    )',
    '                                    [confirmedByAirline] => 1',
    '                                    [operatedBy] =>',
    '                                        [operatedByCode] =>',
    '                                        [marriage] => 0',
    '                                        [raw] => 1 UA 934L 15SEP EWRLHR SS1 830A 840P * SA E',
    '                                        [destinationDate] => Array (',
    '                                            [parsed] => 09-15',
    '                                        )',
    '                                            [departureDt] => Array (',
    '                                                [parsed] => 09-15 08:30',
    '                                                [full] => 2018-09-15 08:30:00',
    '                                            )',
    '                                                [destinationDt] => Array (',
    '                                                    [parsed] => 09-15 20:40',
    '                                                    [full] => 2018-09-15 20:40:00',
    '                                                )',
    '                                                    [cabinClass] => economy',
    '                                                )',
].join('\n');

export let varExportExample = [
    "[",
    "    'destinations' => [",
    "        [",
    "            'departureDate' => '2018-11-12',",
    "            'departure' => 'JFK',",
    "            'destination' => 'LAX',",
    "            'cabinClass' => 'economy',",
    "        ],",
    "        [",
    "            'departureDate' => '2018-12-08',",
    "            'departure' => 'LAX',",
    "            'destination' => 'JFK',",
    "            'cabinClass' => 'economy',",
    "        ],",
    "    ],",
    "    'adult' => 1,",
    "    'child' => 2,",
    "    'infant' => 0,",
    "    'airlinePreferences' => [],",
    "    'stops' => 1,",
    "    'layoverTime' => 24,",
    "]",
    "",
].join('\n');