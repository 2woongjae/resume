import mongoose from 'mongoose';
import Review from '../models/review';

/**
 * @api {get} /review 리뷰 데이터 리스트 가져오기
 * @apiVersion 1.0.0
 * @apiName getReviewList
 * @apiGroup Review
 *
 * @apiParam {String} [vodId] VOD 컬렉션 mongodb ObjectId.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": [{
 *         "_id": "57189cff87a537bc283bba22",
 *         "updatedAt": "2016-04-21T09:27:27.853Z",
 *         "createdAt": "2016-04-21T09:27:27.853Z",
 *         "vodId": "57149e972b8759bc2c712ce5",
 *         "title": "Go in expecting less of DC's version of The Avengers and more of a variation on Watchmen.",
 *         "rate": 2.8,
 *         "content": "After three years of intense hype and scrutiny, Batman v Superman: Dawn of Justice (henceforth known as BvS) is finally here.",
 *         "author": "JIM VEJVODA",
 *         "__v": 0
 *       }]
 *     }
 */
export async function getReviewList(req, res) {
  let options = {
    isRemoved: false
  };
  if (req.query.vodId)
    options.vodId = req.query.vodId;

  let reviewList;
  try {
    reviewList = await Review.find(options, {isRemoved: 0}, {sort: {createdAt: -1}});
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
    data: reviewList
  });
}


/**
 * @api {get} /review/:reviewId 리뷰 데이터 가져오기
 * @apiVersion 1.0.0
 * @apiName getReview
 * @apiGroup Review
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": {
 *         "_id": "57189cff87a537bc283bba22",
 *         "updatedAt": "2016-04-21T09:27:27.853Z",
 *         "createdAt": "2016-04-21T09:27:27.853Z",
 *         "vodId": "57149e972b8759bc2c712ce5",
 *         "title": "Go in expecting less of DC's version of The Avengers and more of a variation on Watchmen.",
 *         "rate": 2.8,
 *         "content": "After three years of intense hype and scrutiny, Batman v Superman: Dawn of Justice (henceforth known as BvS) is finally here.",
 *         "author": "JIM VEJVODA",
 *         "__v": 0,
 *         "isRemoved": false
 *       }
 *     }
 */
export async function getReview(req, res) {
  const reviewId = req.params.reviewId;
  let options = {_id: reviewId};

  let review;
  try {
    review = await Review.findOne(options);
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
    data: review.toObject({getters: false})
  });
}


/**
 * @api {post} /review 리뷰 데이터 입력
 * @apiVersion 1.0.0
 * @apiName postReview
 * @apiGroup Review
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} vodId VOD Mongodb ObjectIb.
 * @apiParam {String} title 리뷰 제목.
 * @apiParam {Number} rate 점수 (max 5).
 * @apiParam {String} content 리뷰 내용.
 * @apiParam {String} author 작성자.
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
export async function postReview(req, res) {
  let review;
  try {
    review = new Review(req.body);
    await review.save();
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
    data: review
  });
}


/**
 * @api {put} /review 리뷰 데이터 수정 (여러 documents 한꺼번에)
 * @apiVersion 1.0.0
 * @apiName putReviews
 * @apiGroup Review
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {Array} ids 리뷰 id list.
 * @apiParam {Boolean} [isRemoved] 리뷰 삭제 여부.
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
export async function putReviews(req, res) {
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
    .map((reviewId) => {
      return {_id: new mongoose.Types.ObjectId(reviewId)}
    });
  const reviewQuery = {...req.body};
  delete reviewQuery.ids;

  try {
    await Review.update(
      {$or: ids},
      {$set: reviewQuery},
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
 * @api {put} /review/:reviewId 리뷰 데이터 수정 (특정 document 하나)
 * @apiVersion 1.0.0
 * @apiName putReview
 * @apiGroup Review
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} title 리뷰 제목.
 * @apiParam {Number} rate 점수 (max 5).
 * @apiParam {String} content 리뷰 내용.
 * @apiParam {String} author 작성자.
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
export async function putReview(req, res) {
  const reviewId = req.params.reviewId;

  try {
    await Review.update({
      _id: new mongoose.Types.ObjectId(reviewId)},
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
 * @api {delete} /review/:reviewId 리뷰 데이터 삭제
 * @apiVersion 1.0.0
 * @apiName deleteReview
 * @apiGroup Review
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
export async function deleteReview(req, res) {
  const reviewId = req.params.reviewId;

  try {
    await Review.update(
      {_id: new mongoose.Types.ObjectId(reviewId)},
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
