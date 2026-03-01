const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    console.log("🎟️ Verifying Token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log("✅ Token Verified for User ID:", req.userId);
    next();
  } catch (err) {
    console.log("❌ Token Verification Failed:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;
