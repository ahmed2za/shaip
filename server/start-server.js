const { exec } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname);

const child = exec('npm run dev', {
  cwd: serverPath,
  windowsHide: true
});

child.stdout.on('data', (data) => {
  console.log(`[SERVER] ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`[SERVER ERROR] ${data}`);
});

child.on('close', (code) => {
  console.log(`[SERVER] Process exited with code ${code}`);
});
