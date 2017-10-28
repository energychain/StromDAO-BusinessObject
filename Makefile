#
# StromDAO Business Object - Decentralized Apps
# Deployment via Makefile to automate general Quick Forward 
#

PROJECT = "StromDAO Business Object"


all: commit origin publish

commit: ;browserify browser_loader.js > dist/loader.js && git commit -a ;
    
test: ;npm test;

origin: ;git push origin;

publish: ;npm publish;
