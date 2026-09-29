import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: true,
  allowedHosts: ['*'],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * REST API: Guest RSVP Submission
 */
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, phone, email, guestsCount, attendingEvents, foodPreference, songRequest, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required guest details' });
    }

    console.log(`[RSVP Received] Guest: ${name} (${phone}), Count: ${guestsCount}, Events: ${attendingEvents?.join(', ')}`);
    return res.status(200).json({
      success: true,
      message: 'RSVP confirmed with royal blessings!',
      data: { name, guestsCount, attendingEvents }
    });
  } catch (error) {
    console.error('[API RSVP Error]', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Anshul & Vidisha Wedding SSR Server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
export { app };
