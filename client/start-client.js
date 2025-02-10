const { exec } = require('child_process');
const path = require('path');

const clientPath = path.join(__dirname);

const child = exec('npm run dev', {
  cwd: clientPath,
  windowsHide: true
});

child.stdout.on('data', (data) => {
  console.log(`[CLIENT] ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`[CLIENT ERROR] ${data}`);
});

child.on('close', (code) => {
  console.log(`[CLIENT] Process exited with code ${code}`);
});
