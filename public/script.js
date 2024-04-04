document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.querySelector('.drop-section')
    const mergeBtn = document.querySelector('.submit-btn')
    const listSection = document.querySelector('.list-section')
    const listContainer = document.querySelector('.list')
    const fileSelector = document.querySelector('.file-selector')
    const fileSelectorInput = document.querySelector('.file-selector-input')

    function addInListSect(file){
        console.log("Enter in this func");
        listSection.style.display = 'block'
        var li = document.createElement('li')
        li.classList.add('complete')
        li.innerHTML = `
            <div class="col">
                <img src="/static/pdf.png" alt="">
            </div>
            <div class="col">
                <div class="file-name">
                    <div class="name">${file.name}</div>
                    <span>0%</span>
                </div>
                <div class="file-progress">
                    <span></span>
                </div>
                <div class="file-size">${(file.size/(1024*1024)).toFixed(2)} MB</div>
            </div>
            <div class="col">
                <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
            </div>
        `
        listContainer.prepend(li)
    }

    // Display uploaded files in the file list
    fileSelector.onclick = () => fileSelectorInput.click()
    fileSelectorInput.addEventListener('change', () => {
        [...fileSelectorInput.files].forEach(file => {
            addInListSect(file);
        });
    });

    // Handle drag and drop
    dropArea.addEventListener('dragover', e => {
        e.preventDefault();
        dropArea.classList.add('drag-over-effect');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over-effect');
    });

    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        dropArea.classList.remove('drag-over-effect');
        fileSelectorInput.files = e.dataTransfer.files;
        [...fileSelectorInput.files].forEach(file => {
            addInListSect(file);
        });
    });

    // Merge PDFs on button click
    mergeBtn.addEventListener('click', async () => {
        const formData = new FormData();
        [...fileSelectorInput.files].forEach(file => {
            formData.append('pdfs', file);
        });

        try {
            const response = await fetch('/merge', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Assuming data contains the merged PDF filename or path
            const mergedPdfUrl = `http://localhost:3000/static/${data.filename}.pdf`;
            
            // Redirect to the merged PDF URL
            window.location.href = mergedPdfUrl;
        } catch (error) {
            console.error('Error merging PDFs:', error);
        }
    });
});

 

