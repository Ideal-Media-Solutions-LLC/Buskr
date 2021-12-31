import handler from '../../handler';
import { locateIP } from '../../db/location';

export default handler({
  async GET(req, res) {
    let ip = req.socket.remoteAddress;
    const lastColon = ip.lastIndexOf(':');
    if (lastColon !== -1 && ip.indexOf('.') !== -1) { // mixed IPv4 and IPv6
      ip = ip.substring(0, lastColon);
    }
    const location = await locateIP(ip);
    res.status(200).json(location);
  },
});
