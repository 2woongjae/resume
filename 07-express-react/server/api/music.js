import mongoose from 'mongoose';
import Music from '../models/music';

/**
 * @api {get} /music 음악 데이터 리스트 가져오기
 * @apiVersion 1.0.0
 * @apiName getMusicList
 * @apiGroup Music
 *
 * @apiParam {String} [q] Music 명 (title), 앨범 명.
 * @apiParam {String} [category] 카테고리 명 ['alternative' || 'hip-hop' || 'country' || 'pop' || 'rnb'].
 * @apiParam {String} [sort] 정렬할 분류 명 ['newRank' || 'recRank' || 'hotRank'].
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": [{
 *         "_id": "57149e972b8759bc2c712ce5",
 *         "updatedAt": "2016-04-20T07:58:01.645Z",
 *         "createdAt": "2016-04-20T07:58:01.645Z",
 *         "title": "Stressed Out",
 *         "image": "http://i1.wp.com/cliffordstumme.com/wp-content/uploads/2015/05/screen-shot-2015-05-28-at-11-55-41-am.png",
 *         "singer": "Twenty One Pilots",
 *         "album": "Blurryface",
 *         "__v": 0,
 *         "lyric": "I wish I found some better sounds no one's ever heard,\n    I wish I had a better voice that sang some better words,\n    I wish I found some chords in an order that is new",
 *         "hotRank": 3,
 *         "recRank": 2,
 *         "newRank": 1,
 *         "categories": [{
 *           "name": "alternative",
 *           "_id": "571736899c3b05801485f141",
 *           "hotRank": 1,
 *           "recRank": 1,
 *           "newRank": 1
 *         }]
 *       }]
 *     }
 */
export async function getMusicList(req, res) {
  const options = {
    isRemoved: false
  };
  const sortOption = {};
  const { q, category, sort } = req.query;
  if (q) {
    const query = new RegExp(q, 'gi');
    options['$or'] = [{title: query}, {album: query}];
  }
  if (category)
    options['categories.name'] = category;
  if (sort)
    sortOption.sort = {[sort]: -1};

  let musicList;
  try {
    musicList = await Music.find(options, {isRemoved: 0}, sortOption);
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }

  let musicSortedIds;

  if (sort && category) {
    // aggregate 에서 1depth nested array 를 1차원 배열로 바꾸어 정렬 처리
    musicSortedIds = await Music.aggregate([
      {$match: {'categories.name': category}},
      {$unwind: '$categories'},
      {$match: {'categories.name': category}},
      {$project: {_id: '$_id', [sort]: `$categories.${sort}`}},
      {$sort: {[sort]: -1}}
    ]).exec();
  }

  if (musicSortedIds)
    // 정렬된 _id 가 들어있는 배열 순서대로 musicList 재생성
    musicList = musicSortedIds.map(item =>
      musicList.find(music => music._id.equals(item._id))
    );

  res.status(200).json({
    meta: {
      status: 200
    },
    data: musicList
  });
}


/**
 * @api {get} /music/:musicId 음악 데이터 가져오기
 * @apiVersion 1.0.0
 * @apiName getMusic
 * @apiGroup Music
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": {
 *         "_id": "57149e972b8759bc2c712ce5",
 *         "updatedAt": "2016-04-20T08:08:20.775Z",
 *         "createdAt": "2016-04-20T08:08:20.775Z",
 *         "title": "Stressed Out",
 *         "file": "http://www.bensound.org/bensound-music/bensound-epic.mp3",
 *         "image": "http://i1.wp.com/cliffordstumme.com/wp-content/uploads/2015/05/screen-shot-2015-05-28-at-11-55-41-am.png",
 *         "singer": "Twenty One Pilots",
 *         "album": "Blurryface",
 *         "__v": 0,
 *         "isRemoved": false,
 *         "lyric": "I wish I found some better sounds no one's ever heard,\n    I wish I had a better voice that sang some better words,\n    I wish I found some chords in an order that is new",
 *         "hotRank": 3,
 *         "recRank": 2,
 *         "newRank": 1,
 *         "categories": [{
 *           "name": "alternative",
 *           "_id": "571738f487ae444c35449dbd",
 *           "hotRank": 1,
 *           "recRank": 1,
 *           "newRank": 1
 *         }]
 *       }
 *     }
 */
export async function getMusic(req, res) {
  const musicId = req.params.musicId;
  let options = {_id: musicId};

  let music;
  try {
    music = await Music.findOne(options);
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
    data: music.toObject({getters: false})
  });
}


/**
 * @api {post} /music 음악 데이터 입력
 * @apiVersion 1.0.0
 * @apiName postMusic
 * @apiGroup Music
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Object[]} categories Music 카테고리.
 * @apiParam {String} categories.name Music 카테고리 이름. [movies || tv-shows || animation || kids]
 * @apiParam {Number} categories.recRank 카테고리의 recommended 부분 노출 우선순위.
 * @apiParam {Number} categories.newRank 카테고리의 new 부분 노출 우선순위.
 * @apiParam {Number} categories.hotRank 카테고리의 hot 부분 노출 우선순위.
 * @apiParam {Number} recRank Music 전체 recommended 부분 노출 우선순위.
 * @apiParam {Number} newRank Music 전체 new 부분 노출 우선순위.
 * @apiParam {Number} hotRank Music 전체 hot 부분 노출 우선순위.
 * @apiParam {String} title 음악 제목.
 * @apiParam {String} file 음악 S3 url.
 * @apiParam {String} image 썸네일 이미지 S3 url.
 * @apiParam {String} singer 가수.
 * @apiParam {String} album 앨범명.
 * @apiParam {String} lyric 가사.
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
export async function postMusic(req, res) {
  let music;
  try {
    music = new Music(req.body);
    await music.save();
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
    data: music
  });
}


/**
 * @api {put} /music 음악 데이터 수정 (여러 documents 한꺼번에)
 * @apiVersion 1.0.0
 * @apiName putMusics
 * @apiGroup Music
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Array} [ids] 음악 id list.
 * @apiParam {Boolean} [isRemoved] 음악 삭제 여부.
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
const putMusicIds = async (req, res) => {
  const ids = req.body.ids
    .map((musicId) => {
      return {_id: new mongoose.Types.ObjectId(musicId)}
    });
  const musicQuery = {...req.body};
  delete musicQuery.ids;

  try {
    await Music.update(
      {$or: ids},
      {$set: musicQuery},
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

export async function putMusics(req, res) {
  // ids 키 들어올 경우 ids 전체를 같은 값으로 set 하는 로직 실행
  if (req.body.ids)
    return putMusicIds(req, res);

  if (!Array.isArray(req.body))
    return res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_request',
        message: errors[0].msg
      }
    });

  // music 각각의 데이터 변경
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

      return Music.update(
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
 * @api {put} /music/:musicId 음악 데이터 수정 (특정 document 하나)
 * @apiVersion 1.0.0
 * @apiName putMusic
 * @apiGroup Music
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Object[]} categories Music 카테고리.
 * @apiParam {String} categories.name Music 카테고리 이름. [movies || tv-shows || animation || kids]
 * @apiParam {Number} categories.recRank 카테고리의 recommended 부분 노출 우선순위.
 * @apiParam {Number} categories.newRank 카테고리의 new 부분 노출 우선순위.
 * @apiParam {Number} categories.hotRank 카테고리의 hot 부분 노출 우선순위.
 * @apiParam {Number} recRank Music 전체 recommended 부분 노출 우선순위.
 * @apiParam {Number} newRank Music 전체 new 부분 노출 우선순위.
 * @apiParam {Number} hotRank Music 전체 hot 부분 노출 우선순위.
 * @apiParam {String} title 음악 제목.
 * @apiParam {String} file 음악 S3 url.
 * @apiParam {String} image 썸네일 이미지 S3 url.
 * @apiParam {String} singer 가수.
 * @apiParam {String} album 앨범명.
 * @apiParam {String} lyric 가사.
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
export async function putMusic(req, res) {
  const musicId = req.params.musicId;

  try {
    await Music.update({
      _id: new mongoose.Types.ObjectId(musicId)},
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
 * @api {delete} /music/:musicId 음악 데이터 삭제
 * @apiVersion 1.0.0
 * @apiName deleteMusic
 * @apiGroup Music
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
export async function deleteMusic(req, res) {
  const musicId = req.params.musicId;

  try {
    await Music.update(
      {_id: new mongoose.Types.ObjectId(musicId)},
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
