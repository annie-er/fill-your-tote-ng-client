# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# ── Stage 2: Serve with Nginx ──────────────────────────────────────────────────
FROM --platform=linux/amd64 nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=build /app/dist/fill-your-tote-ng-client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]