# TrailGuide

## Getting Started:

1. First clone this repository:

   `git clone https://github.com/oslabs-beta/TrailGuide`

2. Install [Docker](https://docs.docker.com/get-started/get-docker/) if it is not installed already
3. Run the following commands from within the TrailGuide directory to deploy the app to a docker container

   `docker build -t trailguide .`

   `docker run -d --name TrailGuide -p 8080:8080 trailguide`
<!-- 
4. (To Run in Development Mode)

   `docker build -t trailguide-dev --target dev .`

   `docker run -it --name trailguide-dev -p 8080:8080 trailguide-dev` -->
