Node script that goes through a DMARC report, and looks up the source hostname for every record of a failure. 

A record is considered a failur if both DKIM and SPF has failed. It does a revers lookup on the source_ip and tries to find the hostname.

My motivation for this script is that I want to check that only hostnames that are likely spam have failed.

Node 7 required. 