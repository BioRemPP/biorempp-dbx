import express from 'express';

function handleGuidedRouteError(error, res, next) {
  if (!(error instanceof Error)) {
    next(error);
    return;
  }

  if (error.message.includes('not found')) {
    res.status(404).json({ error: error.message });
    return;
  }

  if (error.message.includes('Unsupported') || error.message.includes('Unknown') || error.message.includes('invalid')) {
    res.status(400).json({ error: error.message });
    return;
  }

  next(error);
}

export function createGuidedRouter({ guidedEngine, guidedLimiter }) {
  const router = express.Router();

  router.get('/guided/catalog', (_req, res, next) => {
    try {
      res.json(guidedEngine.getCatalogResponse());
    } catch (error) {
      next(error);
    }
  });

  router.get('/guided/queries/:id/options', (req, res, next) => {
    try {
      const rawFilters = {};
      for (const [key, value] of Object.entries(req.query || {})) {
        if (Array.isArray(value)) {
          rawFilters[key] = value[0];
        } else {
          rawFilters[key] = value;
        }
      }
      res.json(guidedEngine.getQueryOptions(req.params.id, rawFilters));
    } catch (error) {
      handleGuidedRouteError(error, res, next);
    }
  });

  router.post('/guided/queries/:id/execute', guidedLimiter, (req, res, next) => {
    try {
      res.json(guidedEngine.executeQuery(req.params.id, req.body || {}));
    } catch (error) {
      handleGuidedRouteError(error, res, next);
    }
  });

  return router;
}
