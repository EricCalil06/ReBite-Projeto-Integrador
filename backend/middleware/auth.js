import jwt from 'jsonwebtoken';

const JWT_SECRET = 'id-secreto'; 

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.usuarioId = decoded.id; 
        req.cargo = decoded.cargo; 
        
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido ou expirado." });
    }
};