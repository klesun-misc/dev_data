

const getRowValues = (rowText) =>
    rowText.slice(1,-1).split('|').map(e => e.trim());

export const sqlSelectToJson = function(sqlSelectText)
{
    let lines = sqlSelectText.trimRight().split('\n');
    let headers = getRowValues(lines[1]);
    let rowLines = lines.slice(3);

    let result = [];
    for (let rowLine of rowLines) {
        if (!rowLine.startsWith('+')) {
            let values = getRowValues(rowLine);
            let row = {};
            for (let i = 0; i < headers.length; ++i) {
                row[headers[i]] = values[i];
            }
            result.push(row);
        }
    }

    return JSON.stringify(result);
};

/** accidentally wrote it two times, yikes */
export const parseSqlGRow2 = function(selectG)
{
    let lines = selectG.split('\n');
    let cols = [];
    for (let line of lines) {
        let matched = line.match(/^(\s*)([A-Za-z][A-Za-z0-9_]*): (.*)$/);
        if (matched) {
            let [_, space, colName, value] = matched;
            let prevCol = cols.slice(-1)[0] || null;
            let width = space.length + colName.length;
            if (!prevCol || prevCol.width === width) {
                cols.push({
                    width: width,
                    name: colName,
                    value: value,
                })
            } else if (cols.length > 0) {
                cols[cols.length - 1].value += '\n' + line;
            }
        } else if (cols.length > 0) {
            cols[cols.length - 1].value += '\n' + line;
        }
    }
    let row = {};
    for (let col of cols) {
        row[col.name] = col.value;
    }
    return Object.keys(row).length > 0 ? row : selectG;
};

export const parseSqlSelectG = (selectG) => {
    let rowBlocks = selectG.split(/(\n|^)\*{10,} \d+\. row \*{10,}\n/);
    return rowBlocks.filter(a => a.trim()).map(parseSqlGRow2);
};

export var someSqlSelect = [
    '+---------------------+------+------------------+-------------------------------------+-------------+----------------------------+----------+---------+-----------+------------------------------------+',
    '| updated_dt          | id   | login            | name                                | fp_initials | email                      | email_lf | team_id | is_active | email_uk                           |',
    '+---------------------+------+------------------+-------------------------------------+-------------+----------------------------+----------+---------+-----------+------------------------------------+',
    '| 2016-08-25 15:56:49 | 7800 | Fredrick Vitelli | Janis Cirulis                       |             | NULL                       |          |     144 |         1 | fredrick.vitelli@asaptickets.co.uk |',
    '| 2016-08-25 15:56:49 | 7798 | Atticus Miller   | Janis Stipnieks                     |             | NULL                       |          |     144 |         0 | atticus.miller@asaptickets.co.uk   |',
    '| 2016-08-25 15:56:49 | 7796 | Neal Kaffrey     | Andrejs Jekimochevs                 |             | NULL                       |          |     144 |         1 | neal.kaffrey@asaptickets.co.uk     |',
    '| 2016-08-25 15:54:22 | 7794 | Kip              | Alexandr Kosenco                    | DR          | kip.k@asaptickets.com      |          |     138 |         1 |                                    |',
    '| 2016-08-25 15:54:22 | 7792 | Laureen          | Monta Jonusa                        | 4S          | laureen.j@asaptickets.com  |          |      77 |         1 |                                    |',
    '| 2016-08-25 15:56:19 | 7790 | Piper.old.3      | Jeena Prusakova                     | KI          | piper.p@asaptickets.com    |          |       4 |         0 |                                    |',
    '| 2016-08-25 15:54:22 | 7788 | Ammelia          | Nithila K M                         | GF          | ammelia.m@asaptickets.com  |          |      74 |         1 |                                    |',
    '| 2016-08-25 15:54:22 | 7786 | Xavier           | Davids Daniels Skrebs               | TS          | xavier.s@asaptickets.com   |          |      77 |         0 |                                    |',
    '| 2016-08-25 15:54:22 | 7784 | Langston         | Patel Mohit Pareshkumar             | HK          | langston.p@asaptickets.com |          |      85 |         1 |                                    |',
    '| 2016-08-25 15:54:21 | 7782 | Freya            | Gamila Abdelfattah Hussein A Hassan | 83          | freya.h@asaptickets.com    |          |     140 |         1 |                                    |',
    '| 2016-08-25 15:54:21 | 7780 | Shiva            | Yashkumar Arvindbhai Donda          | YW          | shiva.d@asaptickets.com    |          |      85 |         1 |                                    |',
    '| 2016-08-25 15:56:18 | 7778 | Morton           | Justin Skariah                      | NH          | morton.s@asaptickets.com   |          |       4 |         0 |                                    |',
    '+---------------------+------+------------------+-------------------------------------+-------------+----------------------------+----------+---------+-----------+------------------------------------+',
].join('\n');

export let someSqlSelectG = [
    '                            id: 12412984',
    '                     trip_type: RT',
    '                       airline: SN',
    '                   alliance_id: 1',
    '             departure_country: US',
    '           destination_country: GH',
    '                departure_city: NYC',
    '              destination_city: ACC',
    '             departure_airport: JFK',
    '           destination_airport: ACC',
    '                  departure_dt: 2018-11-06 18:15:00',
    '              departure_dt_utc: 2018-11-06 23:15:00',
    '                     return_dt: 2018-11-12 23:25:00',
    '                 return_dt_utc: 2018-11-12 23:25:00',
    '                          stay: 5',
    '                 segment_count: 4',
    '                    stop_count: 1',
    '                   cabin_class: economy',
    '                      currency: USD',
    '                          fare: 269.00',
    '                      fare_usd: 269.00',
    '                         taxes: 231.11',
    '                     taxes_usd: 231.11',
    '                          fuel: 427.50',
    '                      fuel_usd: NULL',
    '                     net_price: 927.61',
    '                 net_price_usd: 927.61',
    '                    best_price: 877.61',
    '              has_better_price: 1',
    '             reprice_jobs_left: 1',
    '               is_private_fare: 1',
    '                  is_tour_fare: 0',
    '                is_broken_fare: 0',
    'is_priced_to_wrong_destination: 0',
    '            ticket_designators: CN25',
    '                      added_dt: 2018-04-16 12:49:56',
    '           departure_region_id: 38',
    '         destination_region_id: 34',
    '                        source: GDS_DIRECT_PQ',
    '                  parent_pq_id: NULL',
    '                           gds: apollo',
    '                           pcc: 2G55',
    '                      agent_id: 22250',
    '                  project_name: ITN',
    '                       lead_id: 7953430',
    '                      lead_url: https://cms.asaptickets.com/leadInfo?rId=7953430',
    '                          hash: b3228c5cb64e7ad27ee72ac8420fab32',
    '            should_recalculate: 0',
    '                        log_id: pqt.5ad49bf6.457e1f5',
    '         best_price_email_sent: 0',
    '                itinerary_dump: NO NAMES',
    ' 1 - PSGR P1 ADT                                   RULES DISPLAY',
    'FARE COMPONENT  1    ADT MWZJNB KQ  TSRWTZ',
    'FCL: TSRWTZ    TRF:  31 RULE: TZ11 BK:  T',
    'PTC: ADT-ADULT              FTC: XOX-ONE WAY SPECIAL EXCURSION',
    ' 1 SN 502L 06NOV JFKBRU SS1   615P  730A|*      TU/WE   E  3',
    ' 2 SN 277L 07NOV BRUACC SS1  1110A  455P *         WE   E  3',
    ' 3 SN 278L 12NOV ACCBRU SS1  1125P  700A|*      MO/TU   E  4',
    ' 4 SN 501L 13NOV BRUJFK SS1  1035A  110P *         TU   E  4',
    '',
    '                  pricing_dump: >$BB-*2G55/:A',
    '*FARE HAS A PLATING CARRIER RESTRICTION*',
    'E-TKT REQUIRED',
    'NO REBOOK REQUIRED',
    '',
    '** PRIVATE FARES SELECTED **  ',
    '*PENALTY APPLIES*',
    'LAST DATE TO PURCHASE TICKET: 19APR18',
    '$BB-1 A16APR18     ',
    'NYC SN X/BRU SN ACC 134.62LLLNC1N/CN25 SN X/BRU SN NYC',
    '134.63LLLNC1N/CN25 NUC269.25END ROE1.0',
    'FARE USD 269.00 TAX 5.60AY TAX 36.60US TAX 3.96XA TAX 4.50XF',
    'TAX 7.00XY TAX 5.65YC TAX 47.80BE TAX 20.00G5 TAX 100.00GH TAX',
    '410.00YQ TAX 17.50YR TOT USD 927.61  ',
    'S1 NVB06NOV/NVA06NOV',
    'S2 NVB07NOV/NVA07NOV',
    'S3 NVB12NOV/NVA12NOV',
    'S4 NVB13NOV/NVA13NOV',
    'E REFTHRUAG/NONEND/NONRERTE/',
    'E LH/UA/AC/OS/SN/LX ONLY',
    'TOUR CODE: BT294UA        ',
    'TICKETING AGENCY 2G55',
    'DEFAULT PLATING CARRIER SN',
    'US PFC: XF JFK4.5 ',
    'BAGGAGE ALLOWANCE',
    'ADT                                                         ',
    ' SN NYCACC  2PC                                             ',
    '   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
    '   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
    '   MYTRIPANDMORE.COM/BAGGAGEDETAILSSN.BAGG',
    '                                                                 SN ACCNYC  2PC                                             ',
    '   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
    '   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM',
    '   MYTRIPANDMORE.COM/BAGGAGEDETAILSSN.BAGG',
    '                                                                CARRY ON ALLOWANCE',
    ' SN NYCBRU  1PC                                             ',
    '   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
    ' SN BRUACC  1PC                                             ',
    '   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
    ' SN ACCBRU  1PC                                             ',
    '   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
    ' SN BRUNYC  1PC                                             ',
    '   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM',
    'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
    'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
    '',
    '               best_price_diff: 50.00',
    '                   pricing_cmd: $BB:A',
    '                departure_date: 2018-11-06',
    '          total_ow_travel_time: 1060',
    '      total_return_travel_time: 1125',
].join('\n');