import  jwt,{JwtPayload}  from "jsonwebtoken";


export function verifyJwt<T = JwtPayload>(
  token: string,
  secret :string
): Promise<T> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as T);
    });
  });
}
