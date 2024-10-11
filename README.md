# TrailGuide

## Getting Started:

1. First clone this repository:

   `git clone https://github.com/oslabs-beta/TrailGuide`

2. Install [Docker](https://docs.docker.com/get-started/get-docker/) if it is not installed already
3. Run the following commands to deploy the app to a docker container

   `docker build -t trailguide ../TrailGuide`

   `docker run -d --name TrailGuide trailguide`

4. (To Run in Development Mode)

   `docker build -t trailguide-dev ./TrailGuide`

   `docker run -it --name trailguide-dev trailguide-dev`
