import mongoose from 'mongoose';
import PhotoAlbum from '../models/photo-album';

/**
 * @api {get} /photo-album 사진 앨범 데이터 리스트 가져오기
 * @apiVersion 1.0.0
 * @apiName getPhotoAlbumList
 * @apiGroup PhotoAlbum
 *
 * @apiParam {String} [group] 앨범 그룹 명.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": [{
 *         "_id": "5735821e3eb006883911a932",
 *         "updatedAt": "2016-05-13T07:28:30.731Z",
 *         "createdAt": "2016-05-13T07:28:30.731Z",
 *         "album": "Cloud Album",
 *         "image": "https://c3.staticflickr.com/6/5521/14643896562_1ac9839c2e_h.jpg",
 *         "isNewTag": true,
 *         "__v": 0,
 *         "group": "Family Album"
 *       }, {
 *         "_id": "5735821e3eb006883911a933",
 *         "updatedAt": "2016-05-13T07:28:30.739Z",
 *         "createdAt": "2016-05-13T07:28:30.739Z",
 *         "album": "Panorama",
 *         "image": "https://c8.staticflickr.com/3/2824/11859561023_2a293d3a0f_h.jpg",
 *         "isNewTag": true,
 *         "__v": 0,
 *         "group": "Family Album"
 *       }]
 *     }
 */
export async function getPhotoAlbumList(req, res) {
  let options = {
    isRemoved: false
  };
  if (req.query.group)
    options.group = req.query.group;

  let photoAlbumList;
  try {
    photoAlbumList = await PhotoAlbum.find(options, {isRemoved: 0});
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
    data: photoAlbumList
  });
}


/**
 * @api {get} /photo-album/:photoAlbumId 사진 앨범 데이터 가져오기
 * @apiVersion 1.0.0
 * @apiName getPhotoAlbum
 * @apiGroup PhotoAlbum
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": {
 *         "_id": "5735821e3eb006883911a932",
 *         "updatedAt": "2016-05-13T07:28:30.731Z",
 *         "createdAt": "2016-05-13T07:28:30.731Z",
 *         "album": "Cloud Album",
 *         "image": "https://c3.staticflickr.com/6/5521/14643896562_1ac9839c2e_h.jpg",
 *         "isNewTag": true,
 *         "__v": 0,
 *         "group": "Family Album"
 *       }
 *     }
 */
export async function getPhotoAlbum(req, res) {
  const photoAlbumId = req.params.photoAlbumId;
  let options = {_id: photoAlbumId};

  let photoAlbum;
  try {
    photoAlbum = await PhotoAlbum.findOne(options);
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
    data: photoAlbum.toObject({getters: false})
  });
}


/**
 * @api {post} /photo-album 사진 앨범 데이터 입력
 * @apiVersion 1.0.0
 * @apiName postPhotoAlbum
 * @apiGroup PhotoAlbum
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} group 앨범 그룹.
 * @apiParam {String} album 앨범 이름.
 * @apiParam {String} image 앨범 커버 이미지.
 * @apiParam {Boolean} isNewTag New 마크 붙는지 여부.
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
export async function postPhotoAlbum(req, res) {
  let photoAlbum;
  try {
    photoAlbum = new PhotoAlbum(req.body);
    await photoAlbum.save();
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
    data: photoAlbum
  });
}


/**
 * @api {put} /photo-album 사진 앨범 데이터 수정 (여러 documents 한꺼번에)
 * @apiVersion 1.0.0
 * @apiName putPhotoAlbum
 * @apiGroup PhotoAlbum
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
export async function putPhotoAlbums(req, res) {
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
    .map((photoAlbumId) => {
      return {_id: new mongoose.Types.ObjectId(photoAlbumId)}
    });
  const photoAlbumQuery = {...req.body};
  delete photoAlbumQuery.ids;

  try {
    await PhotoAlbum.update(
      {$or: ids},
      {$set: photoAlbumQuery},
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
 * @api {put} /photo-album/:photoAlbumId 사진 앨범 데이터 수정 (특정 document 하나)
 * @apiVersion 1.0.0
 * @apiName putPhotoAlbum
 * @apiGroup PhotoAlbum
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} group 앨범 그룹.
 * @apiParam {String} album 앨범 이름.
 * @apiParam {String} image 앨범 커버 이미지.
 * @apiParam {Boolean} isNewTag New 마크 붙는지 여부.
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
export async function putPhotoAlbum(req, res) {
  const photoAlbumId = req.params.photoAlbumId;

  try {
    await PhotoAlbum.update({
      _id: new mongoose.Types.ObjectId(photoAlbumId)},
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
 * @api {delete} /photo-album/:photoAlbumId 사진 앨범 데이터 삭제
 * @apiVersion 1.0.0
 * @apiName deletePhotoAlbum
 * @apiGroup PhotoAlbum
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
export async function deletePhotoAlbum(req, res) {
  const photoAlbumId = req.params.photoAlbumId;

  try {
    await PhotoAlbum.update(
      {_id: new mongoose.Types.ObjectId(photoAlbumId)},
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
