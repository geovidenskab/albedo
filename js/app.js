// Hovedapplikation
const app = {
    currentAreaIndex: null,

    init() {
        // Initialiser canvas
        canvasManager.init(document.getElementById('imageCanvas'));

        // Upload events
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3b82f6';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#cbd5e1';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#cbd5e1';
            if (e.dataTransfer.files.length > 0) {
                this.loadImage(e.dataTransfer.files[0]);
            }
        });

        // Gendan tidligere målinger fra localStorage
        this.loadSavedMeasurements();
    },

    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            await this.loadImage(file);
        }
    },

    async loadImage(file) {
        try {
            await canvasManager.loadImage(file);
            
            // Skjul upload, vis canvas
            document.getElementById('uploadSection').classList.add('hidden');
            document.getElementById('canvasSection').classList.remove('hidden');
            
            this.updateUI();
        } catch (error) {
            alert('Fejl ved indlæsning af billede: ' + error.message);
        }
    },

    updateUI() {
        const count = canvasManager.selections.length;
        document.getElementById('selectionCount').textContent = count;
        document.getElementById('finishBtn').disabled = count < 2;

        // Opdater selections liste
        this.updateSelectionsList();
    },

    updateSelectionsList() {
        const container = document.getElementById('selectionsList');
        const selections = canvasManager.selections;

        if (selections.length === 0) {
            container.innerHTML = '';
            return;
        }

        let html = '';
        selections.forEach((sel, index) => {
            const color = index === 0 ? 'color-red' : 'color-green';
            const name = sel.name || (index === 0 ? 'Referencekort' : `Område ${index}`);
            const albedo = sel.albedo !== undefined ? 
                `<span class="selection-albedo">${sel.albedo.toFixed(1)}%</span>` : '';

            html += `
                <div class="selection-item">
                    <div class="color-indicator ${color}"></div>
                    <span class="selection-name">${name}</span>
                    ${albedo}
                    <span class="selection-pixels">${Math.round(sel.width)} × ${Math.round(sel.height)} px</span>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    promptForAreaName(index) {
        this.currentAreaIndex = index;
        document.getElementById('modalAreaNumber').textContent = index;
        document.getElementById('areaNameInput').value = '';
        document.getElementById('nameModal').classList.remove('hidden');
        document.getElementById('areaNameInput').focus();
    },

    saveAreaName() {
        const name = document.getElementById('areaNameInput').value.trim();
        if (name && this.currentAreaIndex !== null) {
            canvasManager.selections[this.currentAreaIndex].name = name;
            canvasManager.drawImage();
            this.updateSelectionsList();
        }
        this.closeModal();
    },

    skipAreaName() {
        this.closeModal();
    },

    closeModal() {
        document.getElementById('nameModal').classList.add('hidden');
        this.currentAreaIndex = null;
    },

    clearLastSelection() {
        canvasManager.clearLast();
    },

    clearAll() {
        if (confirm('Er du sikker på at du vil rydde alle markeringer?')) {
            canvasManager.clearAll();
        }
    },

    finishMeasurements() {
        // Skjul canvas, vis info sektion
        document.getElementById('canvasSection').classList.add('hidden');
        document.getElementById('infoSection').classList.remove('hidden');
    },

    saveMeasurement() {
        const location = document.getElementById('locationInput').value.trim();
        const temperature = document.getElementById('temperatureInput').value;
        const comment = document.getElementById('commentInput').value.trim();

        // Beregn resultater
        const results = calculations.calculateAlbedo(
            canvasManager.selections,
            canvasManager.canvas,
            canvasManager.image
        );

        if (!results) {
            alert('Kunne ikke beregne albedo');
            return;
        }

        // Gem måling
        const measurement = {
            date: new Date().toLocaleDateString('da-DK'),
            timestamp: new Date().toISOString(),
            location: location,
            temperature: temperature,
            comment: comment,
            results: results
        };

        exportManager.addMeasurement(measurement);
        this.saveMeasurementsToStorage();

        // Vis bekræftelse
        this.showConfirmation();

        // Opdater resultat tabel
        this.updateResultsTable();

        // Nulstil form
        document.getElementById('locationInput').value = '';
        document.getElementById('temperatureInput').value = '';
        document.getElementById('commentInput').value = '';

        // Vis resultater og nyt billede knap
        document.getElementById('infoSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('newImageSection').classList.remove('hidden');
    },

    updateResultsTable() {
        const container = document.getElementById('resultsTable');
        const measurements = exportManager.measurements;

        if (measurements.length === 0) {
            container.innerHTML = '<p>Ingen målinger endnu</p>';
            return;
        }

        let html = `
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Dato</th>
                        <th>Område</th>
                        <th>Albedo</th>
                        <th>Lokation</th>
                        <th>Temp (°C)</th>
                        <th>Slet</th>
                    </tr>
                </thead>
                <tbody>
        `;

        measurements.forEach((measurement, mIndex) => {
            measurement.results.forEach((result, rIndex) => {
                if (!result.isReference) {
                    html += `
                        <tr>
                            <td>${measurement.date}</td>
                            <td>${result.name}</td>
                            <td class="result-albedo">${result.albedo.toFixed(1)}%</td>
                            <td>${measurement.location || '-'}</td>
                            <td>${measurement.temperature || '-'}</td>
                            <td>
                                <span class="result-delete" onclick="app.deleteMeasurement(${mIndex}, ${rIndex})">🗑️</span>
                            </td>
                        </tr>
                    `;
                }
            });
        });

        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    },

    deleteMeasurement(measurementIndex, resultIndex) {
        if (confirm('Vil du slette denne måling?')) {
            const measurement = exportManager.measurements[measurementIndex];
            measurement.results.splice(resultIndex, 1);
            
            // Fjern hele målingen hvis ingen resultater tilbage
            if (measurement.results.filter(r => !r.isReference).length === 0) {
                exportManager.measurements.splice(measurementIndex, 1);
            }
            
            this.saveMeasurementsToStorage();
            this.updateResultsTable();
            
            // Skjul resultater hvis ingen målinger
            if (exportManager.measurements.length === 0) {
                document.getElementById('resultsSection').classList.add('hidden');
            }
        }
    },

    showConfirmation() {
        const div = document.createElement('div');
        div.className = 'data-added-confirmation';
        div.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span>✓ Måling gemt!</span>
                <span style="font-size: 0.9rem; opacity: 0.9;">${exportManager.measurements.length} måling(er) i alt</span>
            </div>
        `;
        document.body.appendChild(div);

        setTimeout(() => {
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }, 3000);
    },

    newImage() {
        // Reset alt
        canvasManager.reset();
        
        // Skjul alle sektioner undtagen upload
        document.getElementById('canvasSection').classList.add('hidden');
        document.getElementById('infoSection').classList.add('hidden');
        document.getElementById('newImageSection').classList.add('hidden');
        document.getElementById('uploadSection').classList.remove('hidden');
        
        // Nulstil file input
        document.getElementById('fileInput').value = '';
        
        this.updateUI();
    },

    saveMeasurementsToStorage() {
        try {
            localStorage.setItem('albedo_measurements', JSON.stringify(exportManager.measurements));
        } catch (e) {
            console.warn('Kunne ikke gemme til localStorage:', e);
        }
    },

    loadSavedMeasurements() {
        try {
            const saved = localStorage.getItem('albedo_measurements');
            if (saved) {
                const measurements = JSON.parse(saved);
                exportManager.measurements = measurements;
                
                if (measurements.length > 0) {
                    this.updateResultsTable();
                    document.getElementById('resultsSection').classList.remove('hidden');
                }
            }
        } catch (e) {
            console.warn('Kunne ikke indlæse fra localStorage:', e);
        }
    }
};

// Start app når siden er loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC for at lukke modal
    if (e.key === 'Escape') {
        app.closeModal();
    }
    
    // Enter i modal
    if (e.key === 'Enter' && !document.getElementById('nameModal').classList.contains('hidden')) {
        app.saveAreaName();
    }
});