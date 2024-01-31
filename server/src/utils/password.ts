
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  console.log(password);
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (password, encrypted) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encrypted, (err, result) => {
      if (err) {
        // Handle error (e.g., log it, return an error response, etc.)
        console.error("Error comparing passwords:", err);
        return reject(err);
      }

      // 'result' is a boolean indicating whether the passwords match
      if (result) resolve(true);
      else reject(err);
    });
  });
};

export const getToken = async (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET);
};
