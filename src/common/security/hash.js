import bcrypt from "bcrypt";

export async function hash(password, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}

export async function compare(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
