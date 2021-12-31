import handler from '../../handler';
import EventController from '../../db/event';

const defaultDist = Number(process.env.NEXT_PUBLIC_VISIBLE_METERS);

export default handler({
  async GET(req, res) {
    const center = { lng: req.numParam('lng'), lat: req.numParam('lat') };
    const offset = req.numParam('offset', 0);
    const dist = req.intParam('dist', defaultDist);

    const dates = await EventController.findDates({
      center,
      dist,
      offset,
      search: req.query.search,
    });

    res.status(200).json(dates);
  },
});
