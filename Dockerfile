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





