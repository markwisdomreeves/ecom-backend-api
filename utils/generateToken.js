import jwt from "jsonwebtoken";


const generateToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRED_DATE,
    })

}


export default generateToken;