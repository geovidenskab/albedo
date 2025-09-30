// Export modul til CSV og Excel
const exportManager = {
    measurements: [],

    addMeasurement(measurement) {
        this.measurements.push(measurement);
    },

    clearMeasurements() {
        this.measurements = [];
    },

    exportCSV() {
        if (this.measurements.length === 0) {
            alert('Ingen målinger at eksportere');
            return;
        }

        const headers = ['Dato', 'Område', 'Albedo (%)', 'Pixels', 'Lokation', 'Temperatur (°C)', 'Kommentar'];
        const rows = [];

        this.measurements.forEach(measurement => {
            measurement.results.forEach(result => {
                if (!result.isReference) {
                    rows.push([
                        measurement.date,
                        result.name,
                        result.albedo.toFixed(1).replace('.', ','),
                        result.pixelCount,
                        measurement.location || '',
                        measurement.temperature || '',
                        measurement.comment || ''
                    ]);
                }
            });
        });

        // Opret CSV med semikolon og dansk format
        const csvContent = [
            headers.join(';'),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `albedo_malinger_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },

    exportExcel() {
        if (this.measurements.length === 0) {
            alert('Ingen målinger at eksportere');
            return;
        }

        const headers = ['Dato', 'Område', 'Albedo (%)', 'Pixels', 'Lokation', 'Temperatur (°C)', 'Kommentar'];
        const rows = [];

        this.measurements.forEach(measurement => {
            measurement.results.forEach(result => {
                if (!result.isReference) {
                    rows.push([
                        measurement.date,
                        result.name,
                        result.albedo.toFixed(1).replace('.', ','),
                        result.pixelCount,
                        measurement.location || '',
                        measurement.temperature || '',
                        measurement.comment || ''
                    ]);
                }
            });
        });

        // Opret Excel arbejdsbog
        const wb = XLSX.utils.book_new();
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Sæt kolonnebredder
        ws['!cols'] = [
            { wch: 12 },
            { wch: 20 },
            { wch: 12 },
            { wch: 10 },
            { wch: 25 },
            { wch: 15 },
            { wch: 30 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Albedo Målinger');
        XLSX.writeFile(wb, `albedo_malinger_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
};