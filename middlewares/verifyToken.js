const jwt =require('jsonwebtoken')


/* jwt token verify */
const authenticationVerifier = (req, res, next)=> {

    const token = req.cookies.token;
    const userId = req.session.user_sid;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET,(err, user)=>{
            if(err) res.status(401).json("Invalid token");
            req.user = user;
            next()
        });
    } else if(!token && !userId){
        return res.status(401).json("please login");
    } else {
        return res.status(401).render("notauthen")
        //json("You are not authenticated");
    }
}

/* check if the current user */
const accessLevelVerifier = (req, res, next) => {
    authenticationVerifier(req,res, ()=>{
        if(req.user._id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).render("notauthen")
            //json("You are not allowed to perform this task");
        }
    })
}

/* access_level_verifier('admin') */
const isAdminVerifier = (req, res, next) => {
    authenticationVerifier(req, res, ()=> {
        if(req.user.isAdmin === true) {
            next();
        } else {
            res.status(403).render("notauthen")
            //json("You are not allowed to perform this task")
        }
    })
}

module.exports = { authenticationVerifier, accessLevelVerifier, isAdminVerifier };