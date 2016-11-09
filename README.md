Node script that goes through a DMARC report, and looks up the source hostname for every record of a failure. 

A record is considered a failure if both DKIM and SPF has failed. It does a reverse lookup on the `source_ip` and tries to find the hostname.

My motivation for this script is that I want to verify that the hostnames that fail seem likely to be spammers.

Node 7 required. 