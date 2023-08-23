# John Weathers' Receipt Processor Challenge Solution

This webservice is a Dockerized Node.js app.

## Build / Run Instructions

A quick note: you can build/run using Docker in any way you please, but these are the two options that I used in testing.

### Option 1: Build from Github Repo

1. In your terminal, run the following command: `docker build -t <tag name to reference image> https://github.com/john-weathers/fetch-backend-exercise.git`
2. Once the build is successful, run the following command: `docker run -p 8080:8080 <tag name>` Note: you can choose different ports, this is only one example
3. The app can now be tested (I used Thunder Client)
4. To stop the container, run the following command: `docker stop <container id>` Note: one way to get the container id is running `docker ps`

### Option 2: Build locally

1. In your terminal, navigate to the directory where you'd like to clone the Github repo to
2. `git clone https://github.com/john-weathers/fetch-backend-exercise <optional directory to specify>`
3. In the directory with the cloned files, run the following command: `docker build -t <tag name to reference image> .`
4. Once the build is successful, run the following command: `docker run -p 8080:8080 <tag name>`
5. The app can now be tested (I used Thunder Client)
6. To stop the container, run the following command: `docker stop <container id>` Note: one way to get the container id is running `docker ps`

