import { Request } from "express";
import {UAParser} from "ua-parser-js";

/**
 * Extracts device information from the request headers.
 * @param {Request} req - The Express request object.
 * @returns {Object} An object containing device, OS, browser, and user agent information.
 */
const getDeviceInfo = (req: Request) => {
    const userAgent = req.headers['user-agent'] || '';
    const { os, browser,cpu} = UAParser(userAgent);
    
  const ip =
  req.headers['x-forwarded-for']?.toString().split(',')[0] ||
  req.socket?.remoteAddress ||
  req.ip;

    return {
        ip: ip,                      // e.g., "127.0.0.1"
        os:os,                // e.g., { name: "iOS", version: "14.3" }
        browser:browser,      // e.g., { name: "Chrome", version: "88.0.4324.93" }
        ua: userAgent ,
        cpu: cpu,               // raw user-agent string
    };
};

export default getDeviceInfo;
// This utility function uses the UAParser library to parse the user-agent string
// and extract device, operating system, browser, and user agent information.