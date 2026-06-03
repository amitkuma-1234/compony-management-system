const { db } = require('./db');

const auditLogger = (module) => {
  return (req, res, next) => {
    // We only log mutations: POST, PUT, PATCH, DELETE
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const originalSend = res.send;
      
      res.send = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const userId = req.user ? req.user.id : null;
          const action = req.method;
          const description = `${req.method} request to ${req.originalUrl}`;
          const changes = JSON.stringify({
            body: req.body,
            params: req.params,
            query: req.query
          });

          try {
            db.prepare('INSERT INTO audit_logs (userId, action, module, description, changes) VALUES (?, ?, ?, ?, ?)').run(
              userId,
              action,
              module,
              description,
              changes
            );
          } catch (err) {
            console.error('❌ Failed to log audit event', err);
          }
        }
        originalSend.apply(res, arguments);
      };
    }
    next();
  };
};

module.exports = { auditLogger };
