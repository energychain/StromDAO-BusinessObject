#
# StromDAO Business Object - Decentralized Apps
# Deployment via Makefile to automate general Quick Forward 
#

PROJECT = "StromDAO Business Object"


all: test origin publish

commit: ;git commit -a -m "Updated General";
    
test: ;npm test;

origin: ;git push origin;

publish: ;npm publish;
