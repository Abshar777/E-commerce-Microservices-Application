import jwt, { JwtPayload } from "jsonwebtoken";
import {jwtVerify} from "jose"
import jwtPayload from "../types/jwt";

class Jwt {
  private secret: string;
  constructor() {
    this.secret = process.env.JWT_SECRET || "23@Abhsaravcavavaavvgvagsvcahgvshgashgashgcajhgs";
  }
  generateToken(userId: string) {
    const token = jwt.sign({ userId }, this.secret, {
      expiresIn: "30d",
    });
    return token;
  }

 async verifyToken(token:string){
    const secret = new TextEncoder().encode(
        this.secret || " "
      );
    return await jwtVerify(token, secret) as unknown as jwtPayload
  }
}

export default Jwt;
