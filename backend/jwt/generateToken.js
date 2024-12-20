import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "10d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, // xss
    secure: true,
    sameSite: "none", // csrf
  });
};
console.log('Cookie:', req.cookies.jwt);

export default createTokenAndSaveCookie;
