# Script to build, push bravo-api-image & start container
docker stop cassandra.stream.v1
docker rmi cassandra/stream:latest
docker build --rm -t cassandra/stream:latest .
# docker tag bravo/api gcr.io/bravodevelopmentnew/bravo-api-image
# docker push gcr.io/bravodevelopmentnew/bravo-api-image
docker run --rm -d --name cassandra.stream.v1 -p 4007:4007 cassandra/stream:latest