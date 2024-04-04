const express = require('express')
const path = require('path')
const app = express()
const multer  = require('multer')
const {mergePdfs} = require('./merge')

 
const upload = multer({ dest: 'uploads/' })
app.use('/static', express.static(path.join(__dirname, 'public')))
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"))
})

app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
  console.log('Files received:', req.files); // Log files received
  // let d = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path))
  if (req.files && req.files.length >= 2) {
    console.log('Files are present and >= 2');
    let d = await mergePdfs(
        path.join(__dirname, req.files[0].path),
        path.join(__dirname, req.files[1].path)
    );
    const mergedPdfUrl = `http://localhost:3000/static/${d}.pdf`;
    res.json({ filename: d, url: mergedPdfUrl });
    // Continue with the rest of your code using 'd' if needed
  } else {
      // Handle the case where req.files is undefined or does not contain enough elements
      console.error('Error: Missing files in the request.');
      res.status(400).send('Error: Missing files');
      // Respond with an appropriate error message or status code
  }
  // req.files is array of `pdfs` files
  // req.body will contain the text fields, if there were any
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})




 