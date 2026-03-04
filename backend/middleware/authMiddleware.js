const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: "Accesso negato. Token mancante." });
  }

  try {
    const cleanToken = token.replace('Bearer ', '');
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = verified;
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Token non valido o scaduto." });
  }
};