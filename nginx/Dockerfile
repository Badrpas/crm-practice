FROM nginx:1.12-alpine
COPY --from=front /usr/src/app/build /nginx/www/front
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]