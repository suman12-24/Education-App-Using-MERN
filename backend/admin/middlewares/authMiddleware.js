const isAuthenticated = (req, res, next) => {

    if (req.session?.variables?.isLoggedIn?.value) {
        return next();
    }

    return res.redirect('/admin');
};
module.exports = isAuthenticated;