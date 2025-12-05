import jwt from "jsonwebtoken";
export const generateAcessandRefreshToken = async function () { };
/// Generate the acess token
export const generateAcessToken = async function (userId, role) {
    try {
        const acessToken = await jwt.sign({ id: userId, role }, "ACESSTOKENSECRET", {
            expiresIn: "5m",
        });
        return acessToken;
    }
    catch (err) {
        console.log(err.message);
    }
};
// Generate Refresh Token
export const generateRefreshToken = async function (userId, role) {
    try {
        const refreshToken = jwt.sign({ id: userId, role }, "REFRESHTOKENSECRET");
        return refreshToken;
    }
    catch (err) {
        console.log(err.message);
    }
};
//# sourceMappingURL=token.js.map