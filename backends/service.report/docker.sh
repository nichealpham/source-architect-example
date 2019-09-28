# Script to build, push bravo-api-image & start container
docker stop cassandra.report.v1
docker rmi cassandra/report:latest
docker build --rm -t cassandra/report:latest .
# docker tag bravo/api gcr.io/bravodevelopmentnew/bravo-api-image
# docker push gcr.io/bravodevelopmentnew/bravo-api-image
docker run --rm -d --name cassandra.report.v1 -p 4008:4008 cassandra/report:latest