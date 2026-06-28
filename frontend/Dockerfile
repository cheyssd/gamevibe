# ── STAGE 1 : Build React ──
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ── STAGE 2 : Servir avec Nginx ──
FROM nginx:alpine

# Copier uniquement le résultat du build (pas node_modules, pas le code source)
COPY --from=build /app/dist /usr/share/nginx/html

# Config Nginx spécifique pour gérer les routes React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]