const path = require('node:path');

let cachedHandler = null;

module.exports = async (req, res) => {
  try {
    if (!cachedHandler) {
      const serverPath = path.join(process.cwd(), 'dist/anshul-vidisha-wedding/server/server.mjs');
      const serverModule = await import(serverPath);
      cachedHandler = serverModule.reqHandler || serverModule.app || serverModule.default;
    }
    return cachedHandler(req, res);
  } catch (error) {
    console.error('[Vercel SSR Error]', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error during SSR', message: error.message }));
  }
};
