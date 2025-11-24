
import jwt from "jsonwebtoken";

export const generateAcessandRefreshToken = async function () {};

/// Generate the acess token
export const generateAcessToken = async function (userId: any) {
  try {
    const acessToken = await jwt.sign({ id: userId }, "ACESSTOKENSECRET", {
      expiresIn: "5m",
    });
    return acessToken;
  } catch (err: any) {
    console.log(err.message);
  }
};


// Generate Refresh Token
export const generateRefreshToken = async function(userId:any) {
    try {
        const refreshToken = jwt.sign({id : userId}, "REFRESHTOKENSECRET")
        return refreshToken;

    }catch(err:any) {
        console.log(err.message)
    }
}