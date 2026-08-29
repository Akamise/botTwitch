FROM node:20-alpine

RUN apk add --no-cache ffmpeg streamlink

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

# Yarn 4 по умолчанию использует PnP (без node_modules), а бот запускается
# через `node dist/index.js`, поэтому явно задаём классический node_modules linker.
RUN printf 'nodeLinker: node-modules\n' > .yarnrc.yml

RUN yarn install

COPY . .

RUN yarn prisma generate
RUN mkdir -p /app/data

RUN yarn build

EXPOSE 3042

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start"]