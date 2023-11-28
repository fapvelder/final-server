import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
export const createSlug = (fullName) => {
  // Prepare the slug
  let slug = "";

  // If full name is available, append it to the slug
  if (fullName) {
    const nameSlug = fullName.toLowerCase().replace(/\s+/g, "-"); // Convert to lowercase and replace spaces with dashes
    slug += nameSlug;
  }

  // Append UUID to the slug
  const uuid = uuidv4();
  slug += (slug ? "-" : "") + uuid;

  return slug;
};
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
