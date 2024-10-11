# FROM node:20.18.0 AS base
# WORKDIR  /usr/local/app

# # SERVER IMAGE
# FROM base AS server-base
# WORKDIR ./server
# COPY server/package.json ./
# RUN npm install --omit=dev
# COPY server/src ./src
# EXPOSE 3000
# #TODO: set up enviornment variables for SDK keys

# FROM server-base AS server-dev
# RUN npm install
# CMD ["npm", "run", "dev"]

# FROM server-base AS server
# # TODO: Bundle backend too!
# CMD ["npm", "start"]

# # CLIENT BASE 
# FROM base AS client-base
# WORKDIR ./client
# COPY Frontend-Test/package.json ./
# RUN npm install --omit=dev
# COPY Frontend-Test/tsconfig.json ./
# COPY Frontend-Test/src ./src
# COPY Frontend-Test/index.html ./

# FROM client-base AS client-dev
# RUN npm install
# CMD ["npm", "run", "dev"]

# FROM client-base AS client
# RUN npm build 


# FROM base AS final
# COPY --from=server ./server/*  ./*
# COPY --from=client ./dist/* ./dist/*

#node v20.18.0
FROM node@sha256:fffa89e023a3351904c04284029105d9e2ac7020886d683775a298569591e5bb AS base
WORKDIR  /usr/local/app
ENV PORT=8080
EXPOSE 8080

# create the development image (to run a container on this image you need to use the `--target dev` option)
FROM base AS dev
ENV NODE_ENV=development


# Mostly config files (do them first because they change so infrequently)
COPY *.json ./
COPY *.ts ./
COPY *.js ./
# this line is creating an issue when we later try to copy server/src to ./server/src
# COPY server/*.json ./server 


# download dependencies
RUN npm install

# copy over our code
COPY ./client/index.html ./client/index.html
COPY ./client/src/ ./client/src/
COPY ./server/ ./server/

# build the code for production
RUN npm run build

# do this on container start
CMD ["npm", "run", "dev"]

FROM base AS prod
ENV NODE_ENV=production

# need to figure out how to use vite to bundle server code

COPY package.json ./
COPY --from=dev /usr/local/app/node_modules ./node_modules/
COPY --from=dev /usr/local/app/dist ./dist/
COPY --from=dev /usr/local/app/server/src ./

CMD ["node", "app.js"]





