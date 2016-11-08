import * as fs from 'fs';
import * as xml2js from 'xml2js';

const parser = new xml2js.Parser();
fs.readFile(__dirname + '/google.com!mellbourn.net!1478476800!1478563199.xml', function(err, data) {
    parser.parseString(<any>data, function (err :any, parsedXml: any) {
        const records: any[] = parsedXml.feedback.record;
        for(const record of records) {
            const row = record.row[0];
            const policy_evaluated = row.policy_evaluated[0];
            const dkim = policy_evaluated.dkim[0];
            const spf = policy_evaluated.spf[0];
            if(dkim === 'fail' && spf === 'fail') {
                const source_ip = row.source_ip[0];
                console.log('failed source_ip', source_ip);
            }
        }
        console.log('Done');
    });
});

console.log('last line in script');