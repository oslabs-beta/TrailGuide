FROM node:20.18.0 AS base
WORKDIR  /usr/local/app

# SERVER IMAGE
FROM base AS server-base
WORKDIR ./server
COPY server/package.json ./
RUN npm install --omit=dev
COPY server/src ./src
EXPOSE 3000
#TODO: set up enviornment variables for SDK keys

FROM server-base AS server-dev
RUN npm install
CMD ["npm", "run", "dev"]

FROM server-base AS server
# TODO: Bundle backend too!
CMD ["npm", "start"]

# CLIENT BASE 
FROM base AS client-base
WORKDIR ./client
COPY Frontend-Test/package.json ./
RUN npm install --omit=dev
COPY Frontend-Test/tsconfig.json ./
COPY Frontend-Test/src ./src
COPY Frontend-Test/index.html ./

FROM client-base AS client-dev
RUN npm install
CMD ["npm", "run", "dev"]

FROM client-base AS client
RUN npm build 


FROM base AS final
COPY --from=server ./server/  ./