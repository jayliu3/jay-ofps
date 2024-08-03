FROM node:18 AS frontend-builder
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend ./
RUN yarn build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-builder
WORKDIR /app/backend
COPY backend/*.csproj ./
RUN dotnet restore
COPY backend ./
RUN dotnet publish ofps.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y nginx && apt-get clean
RUN rm -rf /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/ofps_nginx.conf
COPY --from=backend-builder /app/publish /app
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

ENV ASPNETCORE_URLS=http://+:5602
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 80
CMD service nginx start && dotnet ofps.dll
