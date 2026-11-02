const fs = require('fs');
const https = require('https');
const path = require('path');

const data = JSON.parse(fs.readFileSync('C:\\Users\\KUNALL PRASHANTH\\.gemini\\antigravity-ide\\brain\\84802f21-6f66-42b7-9917-5f36af53c127\\.system_generated\\steps\\13\\output.txt', 'utf8'));

const outDir = path.join(__dirname, '..', 'stitch_reference');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const screen of data.screens) {
    const safeTitle = screen.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const screenId = screen.name.split('/').pop();
    console.log('Downloading:', safeTitle, screenId);
    if (screen.htmlCode && screen.htmlCode.downloadUrl) {
      const ext = screen.htmlCode.mimeType === 'image/svg+xml' ? '.svg' : '.html';
      const dest = path.join(outDir, safeTitle + '_' + screenId + ext);
      await downloadFile(screen.htmlCode.downloadUrl, dest);
    }
    if (screen.screenshot && screen.screenshot.downloadUrl) {
      const dest = path.join(outDir, safeTitle + '_' + screenId + '.png');
      await downloadFile(screen.screenshot.downloadUrl, dest);
    }
  }
  console.log('Finished downloading all screens successfully!');
}

run().catch(console.error);
