# Build application
FROM node:13 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

# Production!!!
FROM nginx:1.17-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY --from=build-stage /app/scripts/ /usr/share/nginx/html
COPY --from=build-stage /app/resources/nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod +x /usr/share/nginx/html/generate_dotenv.sh
RUN chmod +x /usr/share/nginx/html/generate_jsenv.sh
RUN apk add --no-cache bash

CMD /bin/bash /usr/share/nginx/html/generate_dotenv.sh && /bin/bash /usr/share/nginx/html/generate_jsenv.sh && nginx -g "daemon off;"
