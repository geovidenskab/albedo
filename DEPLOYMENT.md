# Deployment Guide

## Lokal udvikling

### Metode 1: Python HTTP Server
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Metode 2: Node.js HTTP Server
```bash
# Installer http-server globalt
npm install -g http-server

# Start server
http-server -p 8000
```

### Metode 3: Live Server (VS Code)
- Installer "Live Server" extension i VS Code
- Højreklik på `index.html` og vælg "Open with Live Server"

## GitHub Pages Deployment

1. Gå til repository settings på GitHub
2. Scroll ned til "Pages" sektion
3. Vælg "Deploy from a branch"
4. Vælg "main" branch og "/ (root)" folder
5. Klik "Save"
6. Din app vil være tilgængelig på: `https://geovidenskab.github.io/albedo/`

## Andre hosting platforme

### Netlify
1. Forbind din GitHub repository til Netlify
2. Build command: (tom)
3. Publish directory: `/`
4. Deploy automatisk ved hver commit

### Vercel
1. Installer Vercel CLI: `npm i -g vercel`
2. I projektmappen: `vercel`
3. Følg instruktionerne

### Surge.sh
1. Installer Surge: `npm install -g surge`
2. I projektmappen: `surge`
3. Følg instruktionerne

## Browser kompatibilitet

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Fejlfinding

### CORS fejl
Hvis du får CORS fejl ved lokal udvikling, brug en HTTP server i stedet for at åbne filen direkte.

### Canvas problemer
Sørg for at billederne er fuldt indlæst før canvas operationer.

### LocalStorage
Applikationen bruger localStorage til at gemme målinger. Sørg for at browseren understøtter dette.
