# Script to build, push bravo-api-image & start container
docker stop cassandra.console.v1
docker rmi cassandra/console:latest
docker build --rm -t cassandra/console:latest .
docker tag cassandra/console gcr.io/cassandra/console-image
docker push gcr.io/cassandra/console-image
docker run --rm -d --name cassandra.console.v1 -p 8080:8080 cassandra/console:latest