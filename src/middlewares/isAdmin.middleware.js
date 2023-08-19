const Users  = require("../models/auth.model.js");
const { verify } = require("../libs/jwt.js");

const isAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const adminId = verify(token);
    const admin_id = adminId.userId
    if(admin_id !== undefined){

      const admin = await Users.findAll({
        where: {
          id: adminId.userId,
        },
      }, {
        logging: false,
      });
      
      req.admin = admin; 
    }else{
      res.status(403).json({message: "Not allowed to access"})
    }

    next();
  } catch (error) {
console.log(error.message);
}
};

module.exports = { isAdmin };
