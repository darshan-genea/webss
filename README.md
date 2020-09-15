# WebSS - Website screenshot API

## Installations
### Requirements
- Requirements node v12 - https://nodejs.org/en/download/ 
- Git - Optional - https://git-scm.com/downloads

### Steps
- git clone https://github.com/iroguesniper/webss.git or download https://github.com/iroguesniper/webss/archive/master.zip and extract
- open terminal/cmd and navigate to repo folder
- cd webss
- npm install
- copy .env.example with .env and make required changes (Will work without any changes)
- npm start

### Test installation
- open `v1/screenshot/{websiteURL}` in your browser
- Example - http://localhost:8080/v1/screenshot/www.google.com


## Routes

[GET] - /v1/screenshot/:base64EncodedURL?width=1920&height=1080 (Max width/height = 3000) 

## TODO
- [x] Basic initial code
- [ ] Implement Authentication using API Key
- [ ] Implement request rate limiter
- [ ] Implement image caching to reduce load
- [ ] Memory management, Set max requests to process at once and queue extra requests 
