# Shift Handover 
Server and client


## Build Vue App
In root app folder
> docker run -it --rm -v $(pwd)/front:/app -w /app -p 8000:80 -e NODE_OPTIONS=--openssl-legacy-provider  node:17.8.0 npm run build