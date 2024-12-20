import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  console.log("User ID:", userId);

  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "10d",
  });

  console.log("Generated Token:", token);

  res.cookie("jwt", token, {
    httpOnly: true, // xss
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // csrf
  });
  console.log("Set Cookie:", res.cookie);
};

export default createTokenAndSaveCookie;
