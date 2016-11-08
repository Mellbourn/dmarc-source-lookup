Node script that goes through a DMARC report. 

For every DMARC fail, eg where both DKIM and SPF has failed, it does a revers lookup on the source_ip and tries to find the hostname.

My motivation for this script is that I want to check that only hostnames that are likely spam have failed.

Node 7 required. 