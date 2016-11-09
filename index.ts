import * as fs from 'fs';
import * as xml2js from 'xml2js';
import * as dns from 'dns';
import * as glob from 'glob';

let xmlFileNameOrPattern = process.argv[2];

if (!xmlFileNameOrPattern) {
    xmlFileNameOrPattern = "*.xml";
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
    dns.reverse(source_ip, (err, hostnames) => {
        if (err) {
            console.warn('could not find hostname for: ', source_ip);
        } else {
            console.log('hostnames: ', hostnames);
        }
    });
}

function parseFile(fileName: string) {
    const parser = new xml2js.Parser();
    fs.readFile(fileName, function (err, data) {
        if (err) {
            throw `Could not read file "${fileName}"`;
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

function findFile(filenamePattern: string) {
    glob(filenamePattern, {}, (er, files) => {
        if (er) {
            throw `Could not find file matching "${filenamePattern}"`;
        }
        for (const fileName of files) {
            parseFile(fileName);
        }
    });
}

findFile(xmlFileNameOrPattern);