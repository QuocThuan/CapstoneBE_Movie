import * as jwt from 'jsonwebtoken';
const createResponse = (
  statusCode: number,
  message: string,
  content: any,
): any => {
  return { statusCode, message, content, dateTime: new Date() };
};

const decodedToken = (token: string): any => {
  try {
    console.log(token);
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    return 'Token không hợp lệ';
  }
};

export { createResponse, decodedToken };
