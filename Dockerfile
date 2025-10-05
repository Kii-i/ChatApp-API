FROM node:20 as development
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine as production
WORKDIR /app
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
COPY package*.json . 
RUN npm install --only=production
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules/@prisma ./node_modules/@prisma
CMD [ "node", "dist/index.js" ]

