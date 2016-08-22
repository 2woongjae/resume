import mongoose from 'mongoose';
import Vods from '../models/vods';
import LiveTv from '../models/live-tv';
import Music from '../models/music';

/**
 * @api {get} /search 검색 데이터 가져오기
 * @apiVersion 1.0.0
 * @apiName getSearchList
 * @apiGroup Search
 *
 * @apiParam {String} [q] 검색어.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": [
 *         {
 *           "type": "live-tv",
 *           "_id": "57676fd2318c41340568772c",
 *           "title": "Through the Wormhole",
 *           "image": "http://public.vtouchinc.com/vtv/vods/image/20160617-1466136579043-go73.jpg",
 *           "rate": 4.7,
 *           "isNewTag": false,
 *           "isHotTag": true
 *         }, {
 *           "type": "vod",
 *           "_id": "575a5e1a2c4c756c30519c8f",
 *           "title": "Through the Wormhole",
 *           "image": "http://public.vtouchinc.com/vtv/vods/image/20160617-1466136579043-go73.jpg",
 *           "rate": 4.7,
 *           "isHotTag": true
 *         }, {
 *           "type": "music",
 *           "_id": "575a61558a3735c80ff6c69a",
 *           "title": "The Hills",
 *           "image": "http://public.vtouchinc.com/vtv/music/image/20160613-1465799396044-tef7.jpg"
 *         }, {
 *           "type": "vod",
 *           "_id": "575a5e1a2c4c756c30519c1d",
 *           "title": "The Hateful Eight",
 *           "image": "http://public.vtouchinc.com/vtv/vods/image/20160610-1465544015742-8z61.jpg",
 *           "rate": 4.5,
 *           "isNewTag": true
 *         }
 *       ]
 *     }
 */
export async function getSearchList(req, res) {
  const options = {
    isRemoved: false
  };
  const { q } = req.query;
  if (q)
    options['title'] = new RegExp(q, 'gi');

  let searchList = [];

  let vodList;
  try {
    vodList = await Vods.find(options, {isRemoved: 0});
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }
  searchList = searchList.concat(
    vodList.map(item => {
      return {
        type: 'vod',
        _id: item._id,
        title: item.title,
        image: item.image,
        rate: item.rate,
        isNewTag: item.isNewTag,
        isHotTag: item.isHotTag,
        isSaleTag: item.isSaleTag
      }
    })
  );

  let liveTvList;
  try {
    liveTvList = await LiveTv.find(options, {isRemoved: 0});
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }
  searchList = searchList.concat(
    liveTvList.map(item => {
      return {
        type: 'live-tv',
        _id: item._id,
        title: item.title,
        image: item.image,
        rate: item.rate,
        isNewTag: item.isNewTag,
        isHotTag: item.isHotTag
      }
    })
  );

  let musicList;
  try {
    musicList = await Music.find(options, {isRemoved: 0});
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }
  searchList = searchList.concat(
    musicList.map(item => {
      return {
        type: 'music',
        _id: item._id,
        title: item.title,
        image: item.image
      }
    })
  );

  searchList = searchList.sort((a, b) => a.title > b.title ? -1 : 1);

  res.status(200).json({
    meta: {
      status: 200
    },
    data: searchList
  });
}
