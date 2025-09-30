// Canvas håndtering
const canvasManager = {
    canvas: null,
    ctx: null,
    image: null,
    selections: [],
    isDrawing: false,
    startX: 0,
    startY: 0,

    init(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.setupEvents();
    },

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    },

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.image = img;
                    this.setupCanvas();
                    resolve();
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    setupCanvas() {
        const maxWidth = 1000;
        const maxHeight = 700;
        
        let width = this.image.width;
        let height = this.image.height;

        if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * scale);
            height = Math.floor(height * scale);
        }

        this.canvas.width = width;
        this.canvas.height = height;
        
        this.drawImage();
    },

    drawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        // Konverter til gråtoner
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = gray;
        }

        this.ctx.putImageData(imageData, 0, 0);

        // Tegn markeringer
        this.selections.forEach((sel, index) => this.drawSelection(sel, index));
    },

    drawSelection(selection, index) {
        const color = index === 0 ? '#ef4444' : '#22c55e';
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
        this.ctx.setLineDash([]);

        // Tegn navn
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 14px Arial';
        const name = selection.name || (index === 0 ? 'Referencekort' : `Område ${index}`);
        this.ctx.fillText(name, selection.x, selection.y - 5);

        // Tegn albedo hvis beregnet
        if (selection.albedo !== undefined && index > 0) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.9)';
            this.ctx.fillRect(
                selection.x + selection.width / 2 - 30,
                selection.y + selection.height / 2 - 12,
                60, 24
            );
            this.ctx.fillStyle = '#059669';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                `${selection.albedo.toFixed(1)}%`,
                selection.x + selection.width / 2,
                selection.y + selection.height / 2 + 5
            );
            this.ctx.textAlign = 'left';
        }
    },

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        this.startX = (e.clientX - rect.left) * scaleX;
        this.startY = (e.clientY - rect.top) * scaleY;
        this.isDrawing = true;
    },

    onMouseMove(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;

        this.drawImage();

        const width = currentX - this.startX;
        const height = currentY - this.startY;
        const color = this.selections.length === 0 ? '#ef4444' : '#22c55e';

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(this.startX, this.startY, width, height);
        this.ctx.setLineDash([]);
    },

    onMouseUp(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const endX = (e.clientX - rect.left) * scaleX;
        const endY = (e.clientY - rect.top) * scaleY;

        const width = endX - this.startX;
        const height = endY - this.startY;

        if (Math.abs(width) > 10 && Math.abs(height) > 10) {
            const selection = {
                x: width < 0 ? this.startX + width : this.startX,
                y: height < 0 ? this.startY + height : this.startY,
                width: Math.abs(width),
                height: Math.abs(height),
                name: null
            };

            this.selections.push(selection);
            
            // Beregn albedo for nye markeringer
            if (this.selections.length >= 2) {
                this.calculateAndUpdateAlbedo();
            }
            
            this.drawImage();
            
            // Hvis det er et måleområde (ikke referencekort), spørg om navn
            if (this.selections.length > 1) {
                app.promptForAreaName(this.selections.length - 1);
            }
            
            app.updateUI();
        }

        this.isDrawing = false;
    },

    calculateAndUpdateAlbedo() {
        const results = calculations.calculateAlbedo(this.selections, this.canvas, this.image);
        if (results) {
            results.forEach((result, index) => {
                if (this.selections[index]) {
                    this.selections[index].albedo = result.albedo;
                }
            });
            this.drawImage();
        }
    },

    clearLast() {
        if (this.selections.length > 0) {
            this.selections.pop();
            this.calculateAndUpdateAlbedo();
            this.drawImage();
            app.updateUI();
        }
    },

    clearAll() {
        this.selections = [];
        this.drawImage();
        app.updateUI();
    },

    reset() {
        this.selections = [];
        this.image = null;
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};