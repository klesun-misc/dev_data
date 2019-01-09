class VarExportParserTest extends \PHPUnit_Framework_TestCase
{
    public function provideTestCases()
    {
        $list = [];

        // with PHP_EOL concatenation
        $list[] = [
            implode(PHP_EOL, [
                "[",
                "    [[4, 'legs', 0, 'mealOptions'], 'DINNER/BREAKFAST'],",
                "    [[4, 'legs', 0, 'flightDuration'], '9:55'],",
                "    [[4, 'legs', 0, 'inFlightServicesText'],",
                "        'MOVIE/TELEPHONE/AUDIO PROGRAMMING/'.PHP_EOL.",
                "        'DUTY FREE SALES/NON-SMOKING/'.PHP_EOL.",
                "        'IN-SEAT POWER SOURCE/VIDEO/LIBRARY'],",
                "    [[5, 'segmentNumber'], 6],",
                "]",
            ]),
        ];

        // with "//" comments
        $list[] = [
            implode(PHP_EOL, [
                "[",
                "    [['pricingBlockList', 0, 'fareConstruction', 'fareAndMarkup', 'amount'], '1484.00'],",
                "    [['pricingBlockList', 0, 'fareConstruction', 'amountCharged', 'amount'], '1828.50'],",
                "    // …",
                "    ",
                "    [['pricingBlockList', 0, 'notValidBA', 0, 'number'], '1'],",
                "    [['pricingBlockList', 0, 'notValidBA', 0, 'notValidBefore'], '25DEC'],",
                "    ",
                "    [['pricingBlockList', 1, 'fareConstruction', 'fareAndMarkup', 'amount'], '1115.00'],",
                "    [['pricingBlockList', 1, 'fareConstruction', 'amountCharged', 'amount'], '1459.50'],",
                "    // …",
                "    ",
                "    [['pricingBlockList', 1, 'penaltyApplies'], true],",
                "    [['pricingBlockList', 1, 'ticketingAgencyPcc'], '1O3K'],",
                "]",
            ]),
        ];

        return $list;
    }

    /**
     * @test
     * @dataProvider provideTestCases
     */
    public function testParser($input)
    {
        $expected = eval('return '.$input.';');
        $actual = VarExportParser::parse($input);
        static::assertArraySubset($expected, $actual, 'forward', true);
        static::assertArraySubset($actual, $expected, 'backward', true);
    }
}
