# TrailGuide

[TrailGuide](https://oslabs-beta.github.io/TrailGuideIO/) is a open source AWS cloud security solution for developers who need their cloud security reassured.

We built TrailGuide because we are passionate in solving the data overloading problem in the cloud. Join us!

- Track key management events: Quickly view events related to creating, modifying, or deleting AWS resources.
- Visualize CloudTrail data: Present data in easy-to-read formats, such as pie charts for event distribution and heatmaps for geographical IP access.
- Analyze recent events based on various criteria, such as IP addresses, event types, associated users, and timestamps.

Every single part is fully open source! Fork it, extend it, or deploy it to your own server.

<img src="./client/src/assets/trailguide-readme-main.webp" alt="List View Screenshot" width="500">


# Installation and Spin-Up

- Make sure you have docker installed
- Create your compose.yml file
  - (see our starter version in [Docker Hub](https://hub.docker.com/r/trailguide/trailguide-prod), or copy the one from this repo )
- run `docker compose up` on the command line

# Getting Start:

1. Use the signup link to create user

<img src="./client/src/assets/sign-up.png" alt="List View Screenshot" width="500">

2. Login

<img src="./client/src/assets/log-in.png" alt="List View Screenshot" width="500">

3. Copy paste the aws credentials in the fields in the profile

<img src="./client/src/assets/aws-credential.png" alt="List View Screenshot" width="500">

## Shoutouts :tada:

Omnivore takes advantage of some great open source software:

- [TypeScript](https://www.typescriptlang.org/) - Most of our backend and frontend are written in TypeScript.
- [PostgreSQL](https://www.postgresql.org/)- For managing complex queries and storing event data, PostgreSQL is our go-to. Its reliability and performance are key to managing and analyzing extensive data, enhancing the robustness of our monitoring and analytics features.
- [Docker](https://www.docker.com/)- Thanks to Docker, deploying our platform is seamless and consistent, whether locally or on the cloud. Docker allows us to containerize our ML models and backend services, ensuring reliable and scalable performance for our users.
- [AWS](https://aws.amazon.com/)- AWS forms the backbone of TrailGuide, providing the infrastructure and data streams that allow us to offer real-time monitoring and security insights for AWS environments. CloudTrail logs enable us to dive deep into user activity and detect anomalies as they happen.
- [Scikit-learn](https://scikit-learn.org/)- TrailGuide’s anomaly detection thrives with Scikit-learn's Isolation Forest, enabling real-time detection of unusual activity in CloudTrail logs with efficiency and accuracy.
- And many more awesome libraries, just checkout our package files to see what we are using.

## Requirements for development

TraildeGuide is written in TypeScript and JavaScript.
