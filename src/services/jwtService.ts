import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import config from "../config";

export function signAccessToken(payload: JwtPayload | string): string {

  return jwt.sign(
    payload, 
    config.jwtAccessSecret as Secret, 
    { expiresIn: config.accessTokenExpiresIn } as SignOptions
  );
}

export function signRefreshToken(payload: JwtPayload | string): string {
  
  return jwt.sign(
    payload, 
    config.jwtRefreshSecret as Secret, 
    { expiresIn: config.refreshTokenExpiresIn } as SignOptions
  );
}

export function verifyRefreshToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, config.jwtRefreshSecret as Secret);
  } catch (error) {
    console.error("Invalid refresh token:", error);
    return null;
  }
}