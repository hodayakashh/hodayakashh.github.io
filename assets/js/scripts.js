document.addEventListener("DOMContentLoaded", () => {
    const pdfGallery = document.querySelector(".pdf-gallery");
    const pdfFiles = Array.from({ length: 20 }, (_, i) => `assets/pdfs/lecture${i + 1}.pdf`);

    pdfFiles.forEach((pdfPath, index) => {
        const pdfViewer = document.createElement("div");
        pdfViewer.classList.add("pdf-viewer");
        pdfViewer.dataset.pdf = pdfPath;

        pdfViewer.addEventListener("click", () => toggleExpand(pdfViewer));

        pdfGallery.appendChild(pdfViewer);
    });

    function toggleExpand(viewer) {
        viewer.classList.toggle("expanded");
        if (viewer.classList.contains("expanded")) {
            loadPDF(viewer.dataset.pdf, viewer);
        } else {
            viewer.innerHTML = ""; // Clear PDF content when collapsed
        }
    }

    function loadPDF(pdfPath, container) {
        const pdfjsLib = window["pdfjs-dist/build/pdf"];
        pdfjsLib.GlobalWorkerOptions.workerSrc = "libs/pdfjs/pdf.worker.js";

        pdfjsLib.getDocument(pdfPath).promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                container.appendChild(canvas);

                const renderContext = { canvasContext: context, viewport };
                page.render(renderContext);
            });
        });
    }
});
