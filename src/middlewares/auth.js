const adminAuth = (req, res, next) => {
    const token = "xyz";
    const authorizedToken = "xyz";

    if(token === authorizedToken) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

module.exports = {adminAuth};