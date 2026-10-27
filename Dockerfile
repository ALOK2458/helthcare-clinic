FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node package.json server.js ./
COPY --chown=node:node js ./js
COPY --chown=node:node css ./css
COPY --chown=node:node index.html diet.html ./
RUN mkdir -p data && chown node:node data

USER node
EXPOSE 3000
CMD ["npm", "start"]