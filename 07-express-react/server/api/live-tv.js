import mongoose from 'mongoose';
import LiveTv from '../models/live-tv';

/**
 * @api {get} /live-tv 영상 데이터 리스트 가져오기
 * @apiVersion 1.0.0
 * @apiName getLiveTvList
 * @apiGroup LiveTv
 *
 * @apiParam {String} [q] Live TV 명 (title).
 * @apiParam {Array} ids 영상 id list. (?ids=57149e&ids=bc2c712 형식)
 * @apiParam {String} [category] 카테고리 명 ['movies' || 'tv-shows' || 'animation' || 'kids'].
 * @apiParam {String} [category2th] 하위 카테고리 명 ['action' || 'drama' || 'romance' || 'comedy' || 'family' || 'entertainment' || 'sport/game' || 'kids' || 'documentary'].
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": [{
 *         "_id": "57149e972b8759bc2c712ce5",
 *         "updatedAt": "2016-04-19T07:47:25.553Z",
 *         "createdAt": "2016-04-19T07:47:25.553Z",
 *         "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *         "image": "http://movie.phinf.naver.net/20150710_93/1436502218219AqguW_JPEG/movie_image.jpg?type=m427_320_2",
 *         "title": "The Voice",
 *         "rate": 4,
 *         "age": 7,
 *         "isNewTag": true,
 *         "isHotTag": false,
 *         "channel": 17,
 *         "brodcast": "NBC",
 *         "__v": 0,
 *         "relateContents": ["57149e972b8759bc2c712cea"],
 *         "clip": [{
 *           "title": "Episode #1",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/29253_20151203034301.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f25"
 *         }, {
 *           "title": "Episode #2",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/27624_20150713095138.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f24"
 *         }, {
 *           "title": "Episode #3",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/26800_20150420104917.jpg",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f23"
 *         }],
 *         "cast": ["헨리 카빌", "벤 애플렉", "에이미 아담스"],
 *         "director": ["잭 스나이더"],
 *         "story": "Four famous musicians search for the best voices in America and will mentor these singers to become artists. America will decide which singer will be worthy of the grand prize.",
 *         "subtitle": "",
 *         "hotRank": 3,
 *         "categories": [{
 *           "name": "entertainment",
 *           "_id": "5715e28dd642c9a4089d3f26",
 *           "hotRank": 1
 *         }]
 *       }]
 *     }
 */
export async function getLiveTvList(req, res) {
  const options = {
    isRemoved: false
  };
  const sortOption = {};
  const { q, category, sort, ids } = req.query;
  if (q)
    options.title = new RegExp(q, 'gi');
  if (category)
    options['categories.name'] = category;
  if (ids) {
    options['$or'] = (Array.isArray(ids) ?
        ids : [ids]
      )
      .map(liveTvId => {
        return {_id: new mongoose.Types.ObjectId(liveTvId)}
      });
  }
  if (sort) {
    sortOption.sort = {[sort]: -1};
  }

  let liveTvList;
  try {
    liveTvList = await LiveTv.find(options, {isRemoved: 0}, sortOption);
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }

  if (sort && category) {
    // aggregate 에서 1depth nested array 를 1차원 배열로 바꾸어 정렬 처리
    const liveTvSortedIds = await LiveTv.aggregate([
      {$match: {'categories.name': category}},
      {$unwind: '$categories'},
      {$match: {'categories.name': category}},
      {$project: {_id: '$_id', [sort]: `$categories.${sort}`}},
      {$sort: {[sort]: -1}}
    ]).exec();

    // 정렬된 _id 가 들어있는 배열 순서대로 liveTvList 재생성
    liveTvList = liveTvSortedIds.map(item =>
      liveTvList.find(vod => vod._id.equals(item._id))
    );
  }

  res.status(200).json({
    meta: {
      status: 200
    },
    data: liveTvList
  });
}


/**
 * @api {get} /live-tv/:liveTvId 영상 데이터 가져오기
 * @apiVersion 1.0.0
 * @apiName getLiveTv
 * @apiGroup LiveTv
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": {
 *         "_id": "57149e972b8759bc2c712ce5",
 *         "updatedAt": "2016-04-19T07:47:25.553Z",
 *         "createdAt": "2016-04-19T07:47:25.553Z",
 *         "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *         "image": "http://movie.phinf.naver.net/20150710_93/1436502218219AqguW_JPEG/movie_image.jpg?type=m427_320_2",
 *         "title": "The Voice",
 *         "rate": 4,
 *         "age": 7,
 *         "isNewTag": true,
 *         "isHotTag": false,
 *         "channel": 17,
 *         "brodcast": "NBC",
 *         "__v": 0,
 *         "isRemoved": false,
 *         "relateContents": ["57149e972b8759bc2c712cea"],
 *         "clip": [{
 *           "title": "Episode #1",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/29253_20151203034301.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f25"
 *         }, {
 *           "title": "Episode #2",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/27624_20150713095138.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f24"
 *         }, {
 *           "title": "Episode #3",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/26800_20150420104917.jpg",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f23"
 *         }],
 *         "cast": ["헨리 카빌", "벤 애플렉", "에이미 아담스"],
 *         "director": ["잭 스나이더"],
 *         "story": "Four famous musicians search for the best voices in America and will mentor these singers to become artists. America will decide which singer will be worthy of the grand prize.",
 *         "subtitle": "",
 *         "hotRank": 3,
 *         "categories": [{
 *           "name": "entertainment",
 *           "_id": "5715e28dd642c9a4089d3f26",
 *           "hotRank": 1
 *         }]
 *       }
 *     }
 */
export async function getLiveTv(req, res) {
  const liveTvId = req.params.liveTvId;
  let options = {_id: liveTvId};

  let liveTv;
  try {
    liveTv = await LiveTv.findOne(options);
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }

  res.status(200).json({
    meta: {
      status: 200
    },
    data: liveTv.toObject({getters: false})
  });
}


/**
 * @api {post} /live-tv 영상 데이터 입력
 * @apiVersion 1.0.0
 * @apiName postLiveTv
 * @apiGroup LiveTv
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Object[]} categories Live TV 카테고리.
 * @apiParam {String} categories.name Live TV 카테고리 이름. [entertainment || sport/game || documentary]
 * @apiParam {Number} categories.hotRank 1뎁스 카테고리의 hot 부분 노출 우선순위.
 * @apiParam {Number} hotRank Live TV 전체 hot 부분 노출 우선순위.
 * @apiParam {String} title 영상 제목.
 * @apiParam {String} subtitle 영상 부제, 에피소드 정보.
 * @apiParam {String} video 영상 S3 url.
 * @apiParam {String} image 썸네일 이미지 S3 url.
 * @apiParam {Number} rate 평점.
 * @apiParam {Number} age 등급(관람가). [0 || 7 || 15 || 19]
 * @apiParam {String} story 줄거리.
 * @apiParam {String[]} director 감독.
 * @apiParam {String[]} cast 출연 배우.
 * @apiParam {Boolean} isNewTag New 마크 붙는지 여부.
 * @apiParam {Boolean} isHotTag Hot 마크 붙는지 여부.
 * @apiParam {Number} channel 채널 번호.
 * @apiParam {String} broadcast 방송국 이름.
 * @apiParam {Object[]} clip 클립 영상들. (max 3)
 * @apiParam {String} clip.title 클립 영상 제목.
 * @apiParam {String} clip.video 클립 영상 S3 url.
 * @apiParam {String} clip.image 클립 썸네일 S3 url.
 * @apiParam {String[]} relateContents 관련 컨텐츠 Mongodb ObjectId.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "meta": {
 *        "status": 201
 *       },
 *       "data": {
 *         _id: "5587de822728a74f56a0f742"
 *       }
 *     }
 *
 * @apiError Unauthorized 잘못된 토큰으로 인한 에러.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "meta": {
 *         "status": 401,
 *         "error": "invalid_token",
 *         "message": "Invalid access token"
 *       }
 *     }
 */
export async function postLiveTv(req, res) {
  let liveTv;
  try {
    liveTv = new LiveTv(req.body);
    await liveTv.save();
  } catch(e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_insert_error',
        message: e.toString()
      }
    });
  }

  res.status(201).json({
    meta: {
      status: 201
    },
    data: liveTv
  });
}


/**
 * @api {put} /live-tv 영상 데이터 수정 (여러 documents 한꺼번에)
 * @apiVersion 1.0.0
 * @apiName putLiveTvs
 * @apiGroup LiveTv
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Array} ids 영상 id list.
 * @apiParam {Boolean} [isRemoved] 영상 삭제 여부.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": null
 *     }
 *
 * @apiError Unauthorized 잘못된 토큰으로 인한 에러.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "meta": {
 *         "status": 401,
 *         "error": "invalid_token",
 *         "message": "Invalid access token"
 *       }
 *     }
 */
const putLiveTvIds = async (req, res) => {
  const ids = req.body.ids
    .map((liveTvId) => {
      return {_id: new mongoose.Types.ObjectId(liveTvId)}
    });
  const liveTvQuery = {...req.body};
  delete liveTvQuery.ids;

  try {
    await LiveTv.update(
      {$or: ids},
      {$set: liveTvQuery},
      {multi: true}
    );
  } catch(e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_update_error',
        message: e.toString()
      }
    });
  }

  res.status(200).json({
    meta: {
      status: 200
    }
  });
};

export async function putLiveTvs(req, res) {
  // ids 키 들어올 경우 ids 전체를 같은 값으로 set 하는 로직 실행
  if (req.body.ids)
    return putLiveTvIds(req, res);

  if (!Array.isArray(req.body))
    return res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_request',
        message: errors[0].msg
      }
    });

  // live-tv 각각의 데이터 변경
  // {selector: {'selectorKey': 'selectorValue'}, $set: {setKey: 'setValue'}} 형태로 들어와야함
  try {
    // Promise.all 로 모든 데이터 변경 완료되는걸 기다리게 함
    // selector key 의 경우 Mongodb ObjectId 이면 타입 변경
    await Promise.all(req.body.map(item => {
      const selector = {};
      Object.keys(item.selector).forEach(key => {
        selector[key] = key.includes('_id') ?
          new mongoose.Types.ObjectId(item.selector[key]) :
          item.selector[key];
      });

      return LiveTv.update(
        selector,
        {$set: item.$set}
      );
    }));
  } catch(e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_update_error',
        message: e.toString()
      }
    });
  }

  res.status(200).json({
    meta: {
      status: 200
    }
  });
}


/**
 * @api {put} /live-tv/:liveTvId 영상 데이터 수정 (특정 document 하나)
 * @apiVersion 1.0.0
 * @apiName putLiveTv
 * @apiGroup LiveTv
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Object[]} categories Live TV 카테고리.
 * @apiParam {String} categories.name Live TV 카테고리 이름. [entertainment || sport/game || documentary]
 * @apiParam {Number} categories.hotRank 1뎁스 카테고리의 hot 부분 노출 우선순위.
 * @apiParam {Number} hotRank Live TV 전체 hot 부분 노출 우선순위.
 * @apiParam {String} title 영상 제목.
 * @apiParam {String} subtitle 영상 부제, 에피소드 정보.
 * @apiParam {String} video 영상 S3 url.
 * @apiParam {String} image 썸네일 이미지 S3 url.
 * @apiParam {Number} rate 평점.
 * @apiParam {Number} age 등급(관람가). [0 || 7 || 15 || 19]
 * @apiParam {String} story 줄거리.
 * @apiParam {String[]} director 감독.
 * @apiParam {String[]} cast 출연 배우.
 * @apiParam {Boolean} isNewTag New 마크 붙는지 여부.
 * @apiParam {Boolean} isHotTag Hot 마크 붙는지 여부.
 * @apiParam {Number} channel 채널 번호.
 * @apiParam {String} broadcast 방송국 이름.
 * @apiParam {Object[]} clip 클립 영상들. (max 3)
 * @apiParam {String} clip.title 클립 영상 제목.
 * @apiParam {String} clip.video 클립 영상 S3 url.
 * @apiParam {String} clip.image 클립 썸네일 S3 url.
 * @apiParam {String[]} relateContents 관련 컨텐츠 Mongodb ObjectId.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *          "status": 200
 *       },
 *       "data": null
 *     }
 *
 * @apiError Unauthorized 잘못된 토큰으로 인한 에러.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "meta": {
 *         "status": 401,
 *         "error": "invalid_token",
 *         "message": "Invalid access token"
 *       }
 *     }
 */
export async function putLiveTv(req, res) {
  const liveTvId = req.params.liveTvId;

  try {
    await LiveTv.update({
      _id: new mongoose.Types.ObjectId(liveTvId)},
      {$set: req.body}
    );
  } catch(e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_update_error',
        message: e.toString()
      }
    });
  }

  res.status(200).json({
    meta: {
      status: 200
    }
  });
}


/**
 * @api {delete} /live-tv/:liveTvId 영상 데이터 삭제
 * @apiVersion 1.0.0
 * @apiName deleteLiveTv
 * @apiGroup LiveTv
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *          "status": 200
 *       },
 *       "data": null
 *     }
 *
 * @apiError Unauthorized 잘못된 토큰으로 인한 에러.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "meta": {
 *         "status": 401,
 *         "error": "invalid_token",
 *         "message": "Invalid access token"
 *       }
 *     }
 */
export async function deleteLiveTv(req, res) {
  const liveTvId = req.params.liveTvId;

  try {
    await LiveTv.update(
      {_id: new mongoose.Types.ObjectId(liveTvId)},
      {$set: {isRemoved: true}}
    );
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_update_error',
        message: e.toString()
      }
    });
  }

  res.status(200).json({
    meta: {
      status: 200
    }
  });
}
