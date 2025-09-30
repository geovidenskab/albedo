# Albedo Beregner

En webapplikation til beregning af albedo (reflektionsgrad) fra satellitbilleder eller andre fotografier.

## Funktioner

- **Upload billeder**: Understøtter JPG, PNG og GIF formater
- **Interaktiv markering**: Marker hvidt referencekort og måleområder
- **Real-time beregning**: Se albedo værdier direkte på billedet
- **Automatisk korrektion**: Kompenserer for lysforhold baseret på referencekort
- **Data eksport**: Eksporter resultater til CSV eller Excel
- **Persistent lagring**: Målinger gemmes lokalt i browseren

## Teknisk implementering

### Albedo beregning
Albedo beregnes ved hjælp af følgende formel:
```
Albedo = (Korrigeret pixelværdi ÷ 255) × 100%
```

Hvor:
- **Korrigeret pixelværdi** = (Målt gråtone ÷ Korrektionsfaktor)
- **Korrektionsfaktor** = (Målt hvid værdi ÷ 179)
- **Gråtone** = 0.299×R + 0.587×G + 0.114×B (standard luminance)

### Referencekort
- Hvidt referencekort antages at have 70% albedo
- Forventet pixelværdi: 179 (0.7 × 255)
- Korrektionsfaktor kompenserer for billedets lysstyrke

## Installation

1. Klon repositoryet:
```bash
git clone https://github.com/geovidenskab/albedo.git
cd albedo
```

2. Åbn `index.html` i en webbrowser

## Brug

1. **Upload billede**: Klik på upload-området eller træk et billede ind
2. **Marker referencekort**: Marker først det hvide referencekort (rød markering)
3. **Marker måleområder**: Marker de områder du vil måle (grønne markeringer)
4. **Navngiv områder**: Giv hvert område et beskrivende navn
5. **Tilføj oplysninger**: Udfyld temperatur, lokation og kommentarer
6. **Gem måling**: Klik "Gem måling" for at tilføje til resultatlisten
7. **Eksporter data**: Brug CSV eller Excel eksport til videre analyse

## Projektstruktur

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

## Udviklet af

Philip K. Jakobsen, Silkeborg Gymnasium

## Licens

Dette projekt er udviklet til undervisningsformål.
