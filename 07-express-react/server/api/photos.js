import mongoose from 'mongoose';
import Photos from '../models/photos';

/**
 * @api {get} /photos 사진 데이터 리스트 가져오기
 * @apiVersion 1.0.0
 * @apiName getPhotoList
 * @apiGroup Photo
 *
 * @apiParam {String} [group] 앨범 그룹 명.
 * @apiParam {String} [album] 앨범 명 (title).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": [{
 *         "_id": "573582203eb006883911a937",
 *         "updatedAt": "2016-05-13T07:28:32.494Z",
 *         "createdAt": "2016-05-13T07:28:32.494Z",
 *         "group": "Family Album",
 *         "album": "Cloud Album",
 *         "image": "https://c8.staticflickr.com/3/2807/8994891935_5ba15e749f_c.jpg",
 *         "__v": 0
 *       }, {
 *         "_id": "573582203eb006883911a93b",
 *         "updatedAt": "2016-05-13T07:28:32.501Z",
 *         "createdAt": "2016-05-13T07:28:32.501Z",
 *         "group": "Family Album",
 *         "album": "Panorama",
 *         "image": "https://c3.staticflickr.com/8/7283/26833502786_798f6a53e4_z.jpg",
 *         "__v": 0
 *       }]
 *     }
 */
export async function getPhotoList(req, res) {
  let options = {
    isRemoved: false
  };
  if (req.query.group)
    options.group = req.query.group;
  if (req.query.album)
    options.album = req.query.album;

  let photoList;
  try {
    photoList = await Photos.find(options, {isRemoved: 0});
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
    data: photoList
  });
}


/**
 * @api {get} /photos/:photoId 사진 데이터 가져오기
 * @apiVersion 1.0.0
 * @apiName getPhoto
 * @apiGroup Photo
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": {
 *         "_id": "573582203eb006883911a937",
 *         "updatedAt": "2016-05-13T07:28:32.494Z",
 *         "createdAt": "2016-05-13T07:28:32.494Z",
 *         "group": "Family Album",
 *         "album": "Cloud Album",
 *         "image": "https://c8.staticflickr.com/3/2807/8994891935_5ba15e749f_c.jpg",
 *         "__v": 0
 *       }]
 *     }
 */
export async function getPhoto(req, res) {
  const photoId = req.params.photoId;
  let options = {_id: photoId};

  let photo;
  try {
    photo = await Photos.findOne(options);
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
    data: photo.toObject({getters: false})
  });
}


/**
 * @api {post} /photos 사진 데이터 입력
 * @apiVersion 1.0.0
 * @apiName postPhoto
 * @apiGroup Photo
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} group 앨범 그룹.
 * @apiParam {String} album 앨범 이름.
 * @apiParam {String} image 사진 이미지.
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
export async function postPhoto(req, res) {
  let photo;
  try {
    photo = new Photos(req.body);
    await photo.save();
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
    data: photo
  });
}


/**
 * @api {put} /photos 사진 데이터 수정 (여러 documents 한꺼번에)
 * @apiVersion 1.0.0
 * @apiName putPhotos
 * @apiGroup Photo
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Array} ids 사진 id list.
 * @apiParam {Boolean} [isRemoved] 사진 삭제 여부.
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
export async function putPhotos(req, res) {
  req.checkBody('ids', 'Invalid ids').notEmpty().isArray();

  const errors = req.validationErrors();
  if (errors) return res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_request',
        message: errors[0].msg
      }
    });

  const ids = req.body.ids
    .map((photoId) => {
      return {_id: new mongoose.Types.ObjectId(photoId)}
    });
  const photoQuery = {...req.body};
  delete photoQuery.ids;

  try {
    await Photos.update(
      {$or: ids},
      {$set: photoQuery},
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
}


/**
 * @api {put} /photos/:photoId 사진 데이터 수정 (특정 document 하나)
 * @apiVersion 1.0.0
 * @apiName putPhoto
 * @apiGroup Photo
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} group 앨범 그룹.
 * @apiParam {String} album 앨범 이름.
 * @apiParam {String} image 앨범 커버 이미지.
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
export async function putPhoto(req, res) {
  const photoId = req.params.photoId;

  try {
    await Photos.update({
      _id: new mongoose.Types.ObjectId(photoId)},
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
 * @api {delete} /photos/:photoId 사진 데이터 삭제
 * @apiVersion 1.0.0
 * @apiName deletePhoto
 * @apiGroup Photo
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
export async function deletePhoto(req, res) {
  const photoId = req.params.photoId;

  try {
    await Photos.update(
      {_id: new mongoose.Types.ObjectId(photoId)},
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
