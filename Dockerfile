# Build application
FROM node:13.1.0-alpine as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npx tsc
RUN npx webpack

# Production!!!
FROM node:13.1.0-alpine
WORKDIR /app
COPY --from=build-stage /app/dist/ /app/dist/
COPY --from=build-stage /app/package*.json /app/
RUN npm install --only=prod
CMD node dist/main.node.js
