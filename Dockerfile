# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.16.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    # workaround for npm optional dependencies bug: https://github.com/npm/cli/issues/4828
    # --mount=type=bind,source=package-lock.json,target=package-lock.json \ 
    --mount=type=cache,target=/root/.npm \
    npm i --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps AS build


# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    # workaround for npm optional dependencies bug: https://github.com/npm/cli/issues/4828
    # --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm i

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npx tsc -b
RUN npx vite build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/server ./
COPY --from=build /usr/src/app/dist ./dist



# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD [ "node", "server.js" ]
