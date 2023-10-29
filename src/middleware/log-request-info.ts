import { Request, Response, NextFunction } from 'express';

const logRequestInfo = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, ip, headers, query, body } = req;
  const timestamp = new Date().toISOString();

  console.log(`Timestamp: ${timestamp}`);
  console.log(`Method: ${method}`);
  console.log(`URL: ${url}`);
  console.log(`IP: ${ip}`);
  console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
  console.log(`Query Parameters: ${JSON.stringify(query, null, 2)}`);
  console.log(`Request Body: ${JSON.stringify(body, null, 2)}`);

  next(); // Continue with the request
};

export { logRequestInfo };
