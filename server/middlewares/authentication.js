const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next){
    try {
        let access_token = req.headers.authorization;

        if(!access_token) throw ({name: "Unauthenticated"});   

        const { id } = verifyToken(access_token.slice(7));

        let user = await User.findByPk(id);

        if(!user) throw ({name: "Unauthenticated"});  

        req.user = {
            id: user.id
        }

        console.log(req.user)
        next();

    } catch (error) {
        next(error);
        console.log(error)
    }
}

module.exports = authentication