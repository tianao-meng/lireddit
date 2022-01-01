#!/bin/bash

echo What should the version be?
read VERSION

docker build -t mengtianao/lireddit:$VERSION .
docker push mengtianao/lireddit:$VERSION
ssh root@159.89.114.174 "docker pull mengtianao/lireddit:$VERSION && docker tag mengtianao/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"