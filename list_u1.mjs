import https from 'https';
import fs from 'fs';

const API_URL = 'https://f3knlmzmvg.execute-api.ap-south-1.amazonaws.com';

async function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  try {
    let output = '';
    const ownerId = 'u1';
    output += `Fetching items for owner: ${ownerId}...\n`;
    const result = await fetchJson(`${API_URL}/items?ownerId=${ownerId}`, { method: 'GET' });
    const items = result.items || [];
    output += `Found ${items.length} items for ${ownerId}.\n\n`;

    for (const item of items) {
       output += `ID: ${item.itemId}\n`;
       output += `Title: ${item.title}\n`;
       output += `Desc: ${item.description}\n`;
       output += `Images: ${JSON.stringify(item.imageKeys)}\n`;
       output += '---\n';
    }
    fs.writeFileSync('u1_output.txt', output, 'utf8');

  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

run();
