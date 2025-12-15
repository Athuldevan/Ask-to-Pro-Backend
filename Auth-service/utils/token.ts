
import jwt from "jsonwebtoken";

export const generateAcessandRefreshToken = async function () {};

/// Generate the acess token
export const generateAcessToken = async function (userId: any, role:string) {
  try {
    const accessToken = await jwt.sign({ id: userId ,role}, "ACESSTOKENSECRET", {
      expiresIn: "20m",
    });
    return accessToken;
  } catch (err: any) {
    console.log(err.message);
  }
};


// Generate Refresh Token
export const generateRefreshToken = async function(userId:any, role:string) {
    try {
        const refreshToken = jwt.sign({id : userId, role}, "REFRESHTOKENSECRET")
        return refreshToken;

    }catch(err:any) {
        console.log(err.message)
    }
}