import https from 'https';

const API_URL = 'https://f3knlmzmvg.execute-api.ap-south-1.amazonaws.com';

async function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data || '{}'));
          } catch(e) { reject(e); }
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
  const possibleOwnerIds = [
    'u1', 
    'testuser', 
    'f1807c3e-d7cb-4fae-ac85-b555e8289055', // UUID from subagent
    'test'
  ];

  for (const ownerId of possibleOwnerIds) {
    try {
      console.log(`\nFetching items for owner: ${ownerId}...`);
      const result = await fetchJson(`${API_URL}/items?ownerId=${ownerId}`, { method: 'GET' });
      const items = result.items || [];
      console.log(`Found ${items.length} items for ${ownerId}.`);

      const testItems = items.filter(i => 
        !i.imageKeys || 
        i.imageKeys.length === 0 ||
        i.title.toLowerCase().includes('test')
      );
      
      for (const item of testItems) {
        console.log(`Deleting item: ${item.itemId} (Title: ${item.title})`);
        const body = JSON.stringify({ itemId: item.itemId, ownerId: item.ownerId });
        
        await fetchJson(`${API_URL}/items`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          },
          body
        });
        console.log('Deleted successfully.');
      }
    } catch (err) {
      console.error(`Error for ${ownerId}:`, err.message);
    }
  }
}

run();
