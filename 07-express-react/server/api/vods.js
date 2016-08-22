import mongoose from 'mongoose';
import Vods from '../models/vods';

/**
 * @api {get} /vods 영상 데이터 리스트 가져오기
 * @apiVersion 1.0.0
 * @apiName getVodList
 * @apiGroup Vod
 *
 * @apiParam {String} [q] VOD 명 (title).
 * @apiParam {Array} ids 영상 id list. (?ids=57149e&ids=bc2c712 형식)
 * @apiParam {String} [category] 카테고리 명 ['movies' || 'tv-shows' || 'animation' || 'kids'].
 * @apiParam {String} [category2th] 하위 카테고리 명 ['action' || 'drama' || 'romance' || 'comedy' || 'family' || 'entertainment' || 'sport/game' || 'kids' || 'documentary'].
 * @apiParam {String} [sort] 정렬할 분류 명 ['newRank' || 'recRank'].
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": [{
 *         "_id": "57149e972b8759bc2c712ce5",
 *         "updatedAt": "2016-04-19T07:47:25.345Z",
 *         "createdAt": "2016-04-19T07:47:25.345Z",
 *         "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *         "image": "http://movie.phinf.naver.net/20150710_93/1436502218219AqguW_JPEG/movie_image.jpg?type=m427_320_2",
 *         "title": "Batman v Superman",
 *         "rate": 5,
 *         "age": 7,
 *         "isNewTag": true,
 *         "isHotTag": false,
 *         "isSaleTag": false,
 *         "time": 151,
 *         "price": "$5",
 *         "quality": "UHD",
 *         "expirationDate": 30,
 *         "year": 2016,
 *         "__v": 0,
 *         "relateContents": ["57149e972b8759bc2c712cea"],
 *         "clip": [{
 *           "title": "스토리 예고편",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/29253_20151203034301.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f17"
 *         }, {
 *           "title": "2차 예고편",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/27624_20150713095138.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f16"
 *         }, {
 *           "title": "티저 예고편",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/26800_20150420104917.jpg",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f15"
 *         }],
 *         "thumbnails": ["http://movie.phinf.naver.net/20150710_246/1436502220047G0RYG_JPEG/movie_image.jpg?type=m427_320_2", "http://movie.phinf.naver.net/20150710_95/1436502215976qNA0j_JPEG/movie_image.jpg?type=m427_320_2"],
 *         "cast": ["헨리 카빌", "벤 애플렉", "에이미 아담스"],
 *         "director": ["잭 스나이더"],
 *         "story": "모든 대결에는 이유가 있다!\n    슈퍼맨과 조드 장군의 격렬한 전투 이후 메트로폴리스는 파괴되었고 슈퍼맨은 세계 최고 논쟁의 인물이 되어버린다.\n    한편 배트맨은 그 동안 타락했던 많은 자들처럼 슈퍼맨 역시 언젠가 타락을 할 것이라 생각하며 사회에서 가장 위험한 존재로 여긴다.\n    세계의 미래를 위해 무모하고 제어할 수 없는 힘을 가진 슈퍼맨으로 인해 벌어졌던 일들을 바로 잡으려 하는데…",
 *         "subtitle": "Dawn of Justice",
 *         "recRank": 1,
 *         "newRank": 1,
 *         "categories": [{
 *           "name": "movies",
 *           "_id": "5715e28dd642c9a4089d3f19",
 *           "categories": [{
 *             "name": "action",
 *             "_id": "5715e28dd642c9a4089d3f1a",
 *             "recRank": 1,
 *             "newRank": 1
 *           }],
 *           "recRank": 1,
 *           "newRank": 1
 *         }]
 *       }]
 *     }
 */
export async function getVodList(req, res) {
  const options = {
    isRemoved: false
  };
  const sortOption = {};
  const { q, category, category2th, sort, ids } = req.query;
  if (q)
    options['title'] = new RegExp(q, 'gi');
  if (category)
    options['categories.name'] = category;
  if (category2th)
    options['categories.categories.name'] = category2th;
  if (ids) {
    options['$or'] = (Array.isArray(ids) ?
        ids : [ids]
      )
      .map(vodId => {
        return {_id: new mongoose.Types.ObjectId(vodId)}
      });
  }
  if (sort) {
    sortOption.sort = {[sort]: -1};
  }

  let vodList;
  try {
    vodList = await Vods.find(options, {isRemoved: 0}, sortOption);
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }

  let vodSortedIds;

  if (sort && category && !category2th) {
    // aggregate 에서 1depth nested array 를 1차원 배열로 바꾸어 정렬 처리
    vodSortedIds = await Vods.aggregate([
      {$match: {'categories.name': category}},
      {$unwind: '$categories'},
      {$match: {'categories.name': category}},
      {$project: {_id: '$_id', [sort]: `$categories.${sort}`}},
      {$sort: {[sort]: -1}}
    ]).exec();
  }

  if (sort && category && category2th) {
    // aggregate 에서 2depth nested array 를 1차원 배열로 바꾸어 정렬 처리
    vodSortedIds = await Vods.aggregate([
      {$match: {'categories.name': category,'categories.categories.name': category2th}},
      {$unwind: '$categories'},
      {$match: {'categories.name': category}},
      {$unwind: '$categories.categories'},
      {$project: {_id: '$_id', categories: '$categories.categories'}},
      {$match: {'categories.name': category2th}},
      {$project: {_id: '$_id', [sort]: `$categories.${sort}`}},
      {$sort: {[sort]: -1}}
    ]).exec();
  }

  if (vodSortedIds)
    // 정렬된 _id 가 들어있는 배열 순서대로 vodList 재생성
    vodList = vodSortedIds.map(item =>
      vodList.find(vod => vod._id.equals(item._id))
    );

  res.status(200).json({
    meta: {
      status: 200
    },
    data: vodList
  });
}


/**
 * @api {get} /vods/:vodId 영상 데이터 가져오기
 * @apiVersion 1.0.0
 * @apiName getVod
 * @apiGroup Vod
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": {
 *         "_id": "57149e972b8759bc2c712ce5",
 *         "updatedAt": "2016-04-19T07:47:25.345Z",
 *         "createdAt": "2016-04-19T07:47:25.345Z",
 *         "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *         "image": "http://movie.phinf.naver.net/20150710_93/1436502218219AqguW_JPEG/movie_image.jpg?type=m427_320_2",
 *         "title": "Batman v Superman",
 *         "rate": 5,
 *         "age": 7,
 *         "isNewTag": true,
 *         "isHotTag": false,
 *         "isSaleTag": false,
 *         "time": 151,
 *         "price": "$5",
 *         "quality": "UHD",
 *         "expirationDate": 30,
 *         "year": 2016,
 *         "__v": 0,
 *         "isRemoved": false,
 *         "relateContents": ["57149e972b8759bc2c712cea"],
 *         "clip": [{
 *           "title": "스토리 예고편",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/29253_20151203034301.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f17"
 *         }, {
 *           "title": "2차 예고편",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/27624_20150713095138.gif",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f16"
 *         }, {
 *           "title": "티저 예고편",
 *           "image": "http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/26800_20150420104917.jpg",
 *           "video": "http://public.vtouchinc.com/vtv/test.mp4",
 *           "_id": "5715e28dd642c9a4089d3f15"
 *         }],
 *         "thumbnails": ["http://movie.phinf.naver.net/20150710_246/1436502220047G0RYG_JPEG/movie_image.jpg?type=m427_320_2", "http://movie.phinf.naver.net/20150710_95/1436502215976qNA0j_JPEG/movie_image.jpg?type=m427_320_2"],
 *         "cast": ["헨리 카빌", "벤 애플렉", "에이미 아담스"],
 *         "director": ["잭 스나이더"],
 *         "story": "모든 대결에는 이유가 있다!\n    슈퍼맨과 조드 장군의 격렬한 전투 이후 메트로폴리스는 파괴되었고 슈퍼맨은 세계 최고 논쟁의 인물이 되어버린다.\n    한편 배트맨은 그 동안 타락했던 많은 자들처럼 슈퍼맨 역시 언젠가 타락을 할 것이라 생각하며 사회에서 가장 위험한 존재로 여긴다.\n    세계의 미래를 위해 무모하고 제어할 수 없는 힘을 가진 슈퍼맨으로 인해 벌어졌던 일들을 바로 잡으려 하는데…",
 *         "subtitle": "Dawn of Justice",
 *         "recRank": 1,
 *         "newRank": 1,
 *         "categories": [{
 *           "name": "movies",
 *           "_id": "5715e28dd642c9a4089d3f19",
 *           "categories": [{
 *             "name": "action",
 *             "_id": "5715e28dd642c9a4089d3f1a",
 *             "recRank": 1,
 *             "newRank": 1
 *           }],
 *           "recRank": 1,
 *           "newRank": 1
 *         }]
 *       }
 *     }
 */
export async function getVod(req, res) {
  const vodId = req.params.vodId;
  let options = {_id: vodId};

  let vod;
  try {
    vod = await Vods.findOne(options);
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
    data: vod.toObject({getters: false})
  });
}


/**
 * @api {post} /vods 영상 데이터 입력
 * @apiVersion 1.0.0
 * @apiName postVod
 * @apiGroup Vod
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Object[]} categories VOD 카테고리.
 * @apiParam {String} categories.name VOD 카테고리 이름. [movies || tv-shows || animation || kids]
 * @apiParam {Number} categories.recRank 1뎁스 카테고리의 recommended 부분 노출 우선순위.
 * @apiParam {Number} categories.newRank 1뎁스 카테고리의 new 부분 노출 우선순위.
 * @apiParam {Object[]} categories.categories VOD 2뎁스 카테고리.
 * @apiParam {String} categories.name 2뎁스 카테고리 이름. [action || drama || romance || comedy || family || entertainment || sport/game || kids || documentary]
 * @apiParam {Number} categories.categories.recRank 2뎁스 카테고리의 recommended 부분 노출 우선순위.
 * @apiParam {Number} categories.categories.newRank 2뎁스 카테고리의 new 부분 노출 우선순위.
 * @apiParam {Number} recRank VOD 전체 recommended 부분 노출 우선순위.
 * @apiParam {Number} newRank VOD 전체 new 부분 노출 우선순위.
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
 * @apiParam {Boolean} isSaleTag Sale 마크 붙는지 여부.
 * @apiParam {Number} time 총 재생 시간. (초단위)
 * @apiParam {String[]} thumbnails 영상 점프 기능을 위한 미리보기 썸네일 S3 url.
 * @apiParam {String} price 가격. ($4, $9 등 문자로)
 * @apiParam {String} quality 해상도. [FHD || HD || UHD]
 * @apiParam {Number} expirationDate 유효기간. (일단위)
 * @apiParam {Number} year 출시년도.
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
export async function postVod(req, res) {
  let vod;
  try {
    vod = new Vods(req.body);
    await vod.save();
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
    data: vod
  });
}


/**
 * @api {put} /vods 영상 데이터 수정 (여러 documents 한꺼번에)
 * @apiVersion 1.0.0
 * @apiName putVods
 * @apiGroup Vod
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Array} [ids] 영상 id list.
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
const putVodIds = async (req, res) => {
  const ids = req.body.ids
    .map((vodId) => {
      return {_id: new mongoose.Types.ObjectId(vodId)}
    });
  const vodQuery = {...req.body};
  delete vodQuery.ids;

  try {
    await Vods.update(
      {$or: ids},
      {$set: vodQuery},
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

export async function putVods(req, res) {
  // ids 키 들어올 경우 ids 전체를 같은 값으로 set 하는 로직 실행
  if (req.body.ids)
    return putVodIds(req, res);

  if (!Array.isArray(req.body))
    return res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_request',
        message: errors[0].msg
      }
    });

  // vod 각각의 데이터 변경
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

      return Vods.update(
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
 * @api {put} /vods/:vodId 영상 데이터 수정 (특정 document 하나)
 * @apiVersion 1.0.0
 * @apiName putVod
 * @apiGroup Vod
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Object[]} categories VOD 카테고리.
 * @apiParam {String} categories.name VOD 카테고리 이름. [movies || tv-shows || animation || kids]
 * @apiParam {Number} categories.recRank 1뎁스 카테고리의 recommended 부분 노출 우선순위.
 * @apiParam {Number} categories.newRank 1뎁스 카테고리의 new 부분 노출 우선순위.
 * @apiParam {Object[]} categories.categories VOD 2뎁스 카테고리.
 * @apiParam {String} categories.name 2뎁스 카테고리 이름. [action || drama || romance || comedy || family || entertainment || sport/game || kids || documentary]
 * @apiParam {Number} categories.categories.recRank 2뎁스 카테고리의 recommended 부분 노출 우선순위.
 * @apiParam {Number} categories.categories.newRank 2뎁스 카테고리의 new 부분 노출 우선순위.
 * @apiParam {Number} recRank VOD 전체 recommended 부분 노출 우선순위.
 * @apiParam {Number} newRank VOD 전체 new 부분 노출 우선순위.
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
 * @apiParam {Boolean} isSaleTag Sale 마크 붙는지 여부.
 * @apiParam {Number} time 총 재생 시간. (초단위)
 * @apiParam {String[]} thumbnails 영상 점프 기능을 위한 미리보기 썸네일 S3 url.
 * @apiParam {String} price 가격. ($4, $9 등 문자로)
 * @apiParam {String} quality 해상도. [FHD || HD || UHD]
 * @apiParam {Number} expirationDate 유효기간. (일단위)
 * @apiParam {Number} year 출시년도.
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
export async function putVod(req, res) {
  const vodId = req.params.vodId;

  try {
    await Vods.update({
      _id: new mongoose.Types.ObjectId(vodId)},
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
 * @api {delete} /vods/:vodId 영상 데이터 삭제
 * @apiVersion 1.0.0
 * @apiName deleteVod
 * @apiGroup Vod
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
export async function deleteVod(req, res) {
  const vodId = req.params.vodId;

  try {
    await Vods.update(
      {_id: new mongoose.Types.ObjectId(vodId)},
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
