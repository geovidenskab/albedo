# Contributing to Albedo Calculator

Tak for din interesse i at bidrage til Albedo Calculator! Dette projekt er udviklet til undervisningsformål, og vi modtager gerne forslag til forbedringer.

## Hvordan du kan bidrage

### Rapportering af fejl
- Brug GitHub Issues til at rapportere fejl
- Inkluder trin-for-trin instruktioner til at reproducere problemet
- Beskriv forventet vs. faktisk adfærd

### Foreslå nye funktioner
- Åbn en Issue med "Feature Request" label
- Beskriv funktionen og dens anvendelsesområde
- Forklar hvorfor det ville være nyttigt for brugere

### Kode bidrag
1. Fork repositoryet
2. Opret en feature branch (`git checkout -b feature/amazing-feature`)
3. Commit dine ændringer (`git commit -m 'Add amazing feature'`)
4. Push til branch (`git push origin feature/amazing-feature`)
5. Åbn en Pull Request

## Udviklingsmiljø

### Setup
1. Klon repositoryet
2. Åbn `index.html` i en webbrowser
3. For lokal udvikling kan du bruge en simpel HTTP server:
   ```bash
   python -m http.server 8000
   # eller
   python3 -m http.server 8000
   ```

### Kodestandard
- Brug semantisk HTML
- Følg eksisterende CSS naming conventions
- Kommenter kompleks JavaScript kode
- Test i forskellige browsere (Chrome, Firefox, Safari)

### Projektstruktur
```
albedo/
├── index.html          # Hoved HTML fil
├── css/
│   └── styles.css      # Styling
├── js/
│   ├── app.js          # Hovedapplikation
│   ├── canvas.js       # Canvas håndtering
│   ├── calculations.js # Albedo beregninger
│   └── export.js       # Data eksport
└── README.md           # Dokumentation
```

## Undervisningsformål

Dette projekt er designet til:
- Geografi og klimatologi undervisning
- Remote sensing introduktion
- Albedo koncept forståelse
- Praktisk anvendelse af satellitdata

## Kontakt

For spørgsmål eller forslag, kontakt Philip K. Jakobsen på Silkeborg Gymnasium.
