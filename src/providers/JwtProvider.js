import JWT from 'jsonwebtoken';

/**
 * 
 * Function create a new  token - 3 parameters
 * userInfo: Info want to be assigned to token
 * secectSignature
 * tokenLife
 * 
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
    try {
        return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife });
    } catch (error) { throw new Error(error); }
}


/**
 * Function check if a token is valid
 */
const verifyToken = async (token, secretSignature) => {
    try {
        return JWT.verify(token, secretSignature);
    } catch (error) { throw new Error(error); }
}

export const JwtProvider = {
    generateToken,
    verifyToken
}