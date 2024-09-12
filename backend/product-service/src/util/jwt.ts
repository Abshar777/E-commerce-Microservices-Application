import jwt from "jsonwebtoken";
import {jwtVerify} from "jose"

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

  verifyToken(token:string){
    const secret = new TextEncoder().encode(
        this.secret || " "
      );
    return jwtVerify(token,secret)
  }
}

export default Jwt;
