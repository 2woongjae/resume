import jwt from 'jsonwebtoken';
import { jwtSecretKey } from '../config';
import Users from '../models/users';

/**
 * @api {post} /auth/login 유저 로그인
 * @apiVersion 1.0.0
 * @apiName postLogin
 * @apiGroup Auth
 *
 * @apiParam {String} email_address email ID
 * @apiParam {String} password 사용자 비밀번호
 *
 * @apiSuccess {String} token 유저 토큰. (JWT)
 * @apiSuccess {Object} user 유저 데이터.
 * @apiSuccess {String} user._id 유저 document id.
 * @apiSuccess {String} user.email_address 유저 email.
 * @apiSuccess {String} user.createdAt 유저 생성일.
 * @apiSuccess {String} user.updatedAt 유저 정보 업데이트일.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *         "status": 200
 *       },
 *       "data": {
 *         "token": "eyJhbGciOiJ.eyJzdWIiOiIx.TJVA95OrM7E2cBab3",
 *         "user": {
 *           "_id": "A0BE4990",
 *           "email_address": "test@vtouch.kr",
 *           "createdAt": Date("2016-02-24T05:00:36.933Z")
 *         }
 *       }
 *     }
 *
 * @apiError UserNotFound email 주소가 등록되어있지 않은 경우.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "meta": {
 *         "status": 400,
 *         "error": "invalid_email",
 *         "message": "유저를 찾을 수 없습니다."
 *       },
 *     }
 *
 * @apiError InvalidPassword 유저 패스워드가 틀렸을 경우.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "meta": {
 *         "status": 400,
 *         "error": "invalid_password",
 *         "message": "패스워드가 일치하지 않습니다."
 *       },
 *     }
 */
export async function postLogin(req, res) {
  req.checkBody('email_address', 'Required email address').notEmpty();
  req.checkBody('password', 'Required password').notEmpty();

  var errors = req.validationErrors();
  if (errors)
    return res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_request',
        message: errors[0].msg
      }
    });

  const userId = req.body.email_address;
  const userPassword = req.body.password;

  let user;
  try {
     user = await Users.findOne({email_address: userId});
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }

  if (!user) {
    res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_email',
        message: '유저를 찾을 수 없습니다.'
      }
    });
  }

  if (!user.comparePassword(userPassword)) {
    res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_password',
        message: '패스워드가 일치하지 않습니다.'
      }
    });
  }

  const token = jwt.sign({
    _id: user._id,
    email_address: user.email_address
  }, jwtSecretKey);

  res.json({
    meta: {
      status: 200
    },
    data: {
      token: token,
      user: {
        _id: user._id,
        email_address: user.email_address,
        createdAt: user.createdAt
      }
    }
  });
}
