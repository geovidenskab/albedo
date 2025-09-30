// Albedo beregningsmodul
const calculations = {
    // Beregn gennemsnitlig pixelværdi for et område
    getPixelValues(imageData, selection, canvas, originalImage) {
        const scaleX = originalImage.width / canvas.width;
        const scaleY = originalImage.height / canvas.height;

        const scaledX = Math.floor(selection.x * scaleX);
        const scaledY = Math.floor(selection.y * scaleY);
        const scaledWidth = Math.floor(selection.width * scaleX);
        const scaledHeight = Math.floor(selection.height * scaleY);

        // Opret temporært canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;

        // Tegn relevant del af billedet
        tempCtx.drawImage(
            originalImage,
            scaledX, scaledY, scaledWidth, scaledHeight,
            0, 0, scaledWidth, scaledHeight
        );

        // Hent pixeldata
        const data = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight).data;

        let totalGray = 0;
        let pixelCount = 0;

        // Beregn gennemsnitlig gråtone
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Standard luminance formel
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            totalGray += gray;
            pixelCount++;
        }

        return {
            averageGray: totalGray / pixelCount,
            pixelCount: pixelCount
        };
    },

    // Beregn albedo for alle markeringer
    calculateAlbedo(selections, canvas, originalImage) {
        if (selections.length < 2) {
            return null;
        }

        const results = [];
        
        // Reference kort (første markering)
        const referencePixels = this.getPixelValues(null, selections[0], canvas, originalImage);
        const expectedWhiteValue = 179; // 0.7 * 255 for 70% albedo
        const correctionFactor = referencePixels.averageGray / expectedWhiteValue;

        results.push({
            name: selections[0].name || 'Referencekort',
            albedo: 70,
            pixelCount: referencePixels.pixelCount,
            rawValue: referencePixels.averageGray,
            correctedValue: referencePixels.averageGray / correctionFactor,
            isReference: true
        });

        // Beregn albedo for måleområder
        for (let i = 1; i < selections.length; i++) {
            const pixels = this.getPixelValues(null, selections[i], canvas, originalImage);
            const correctedValue = pixels.averageGray / correctionFactor;
            const albedo = (correctedValue / 255) * 100;

            results.push({
                name: selections[i].name || `Område ${i}`,
                albedo: albedo,
                pixelCount: pixels.pixelCount,
                rawValue: pixels.averageGray,
                correctedValue: correctedValue,
                isReference: false
            });
        }

        return results;
    }
};