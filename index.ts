import * as fs from 'fs';
import * as xml2js from 'xml2js';
import * as dns from 'dns';

const xmlFileName = process.argv[2];

if (!xmlFileName) {
    throw 'Must give file name on command line';
}

function handleRecord(record: any) {
    const row = record.row[0];
    const policy_evaluated = row.policy_evaluated[0];
    const dkim = policy_evaluated.dkim[0];
    const spf = policy_evaluated.spf[0];
    if (dkim === 'fail' && spf === 'fail') {
        const source_ip = row.source_ip[0];
        handleFail(source_ip);
    }
}

function handleFail(source_ip: string) {
    console.log('failed source_ip', source_ip);
    dns.reverse(source_ip, (err, hostnames) => {
        if (err) {
            console.warn('failed for', source_ip);
        } else {
            console.log('hostnames:', hostnames);
        }
    });
}

function parseFile(xmlFileName: string) {
    const parser = new xml2js.Parser();
    fs.readFile(xmlFileName, function (err, data) {
        if(err) {
            throw `Could not read file "${xmlFileName}"`;
        }
        parser.parseString(<any>data, function (err: any, parsedXml: any) {
            const records: any[] = parsedXml.feedback.record;
            for (const record of records) {
                handleRecord(record);
            }
            console.log('Done');
        });
    });
}

parseFile(xmlFileName);