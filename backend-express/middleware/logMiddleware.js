const Log = require('../models/logModel');

// Ovo je funkcija koja vraća middleware, da bismo mogli da prosledimo akciju
const logAction = (action) => async (req, res, next) => {
    // Logujemo samo ako je korisnik ulogovan
    if (req.user) {
        let details = `Payload: ${JSON.stringify(req.body)}`;
        // Ako su parametri prazni, logujemo samo payload
        if (req.params && Object.keys(req.params).length > 0) {
            details += `; Params: ${JSON.stringify(req.params)}`;
            if (req.params.id) {
            details += `; postId=${req.params.id}`;
            }
        }
        
        const log = new Log({
            username: req.user.username,
            action: action,
            method: `${req.method} ${req.originalUrl}`,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            details: details
        });
        await log.save();
    }
    next(); // Nastavljamo sa izvršavanjem sledećeg middleware-a ili kontrolera
};

module.exports = { logAction };