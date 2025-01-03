import { GlobalWorkerOptions } from '../libs/pdfjs-dist/pdf.mjs';
import * as pdfjsLib from '../libs/pdfjs-dist/pdf.mjs';

const workerSrc = new URL('../libs/pdfjs-dist/pdf.worker.mjs', import.meta.url);
GlobalWorkerOptions.workerSrc = workerSrc.href;
document.addEventListener("DOMContentLoaded", async () => {
    const pdfGallery = document.querySelector(".pdf-gallery");
    const pdfFiles = [
        "assets/pdfs/lecture1.pdf",
        "assets/pdfs/lecture2.pdf"
    ];

    async function createPdfThumbnail(pdfPath) {
        try {
            // Show loading state
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'pdf-loading';
            loadingDiv.textContent = 'Loading...';
            
            // Fetch PDF file
            const response = await fetch(pdfPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            
            // Load PDF
            const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(blob));
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            
            const scale = 0.5;
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const div = document.createElement('div');
            div.className = 'pdf-thumbnail';
            div.appendChild(canvas);
            
            // Add filename label
            const label = document.createElement('div');
            label.className = 'pdf-label';
            label.textContent = pdfPath.split('/').pop();
            div.appendChild(label);
            
            div.addEventListener('click', () => {
                window.open(pdfPath, '_blank');
            });
            
            return div;
        } catch (error) {
            console.error(`Error loading PDF: ${pdfPath}`, error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'pdf-error';
            errorDiv.textContent = `Failed to load ${pdfPath.split('/').pop()}`;
            return errorDiv;
        }
    }

    for (const pdfPath of pdfFiles) {
        const thumbnail = await createPdfThumbnail(pdfPath);
        if (thumbnail) {
            pdfGallery.appendChild(thumbnail);
        }
    }
});
