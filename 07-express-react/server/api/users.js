import mongoose from 'mongoose';
import Users from '../models/users';

/**
 * @api {post} /users 유저 생성
 * @apiVersion 1.0.0
 * @apiName postUsers
 * @apiGroup Users
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} email_address 유저 아이디
 * @apiParam {String} password 유저 비밀번호
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "meta": {
 *         "status": 201
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
export async function postUsers(req, res) {
  req.checkBody('email_address', 'Invalid email_address').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty();

  const errors = req.validationErrors();
  if (errors)
    return res.status(400).json({
      meta: {
        status: 400,
        error: 'invalid_request',
        message: errors[0].msg
      }
    });

  const userId = req.body.email_address;
  const password = req.body.password;

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
  if (user)
    // 유저 아이디가 이미 있는 경우 에러 리턴
    return res.status(400).json({
      meta: {
        status: 400,
        error: 'duplicate_email_address',
        message: '중복된 유저 아이디가 있습니다'
      }
    });

  const newUser = new Users({
    email_address: userId,
    password
  });
  newUser.save()
    .then(() => {
      res.status(201).json({
        meta: {
          status: 201
        },
        data: null
      });
    })
    .catch(e => {
      res.status(500).json({
        meta: {
          status: 500,
          error: 'database_insert_error',
          message: e.toString()
        }
      });
    });
}

/**
 * @api {put} /me 유저 정보 변경
 * @apiVersion 1.0.0
 * @apiName putUsers
 * @apiGroup Users
 *
 * @apiHeader {String} authorization json web token. (Bearer eyJ0eXAiOiJK)
 *
 * @apiParam {String} [current_password] 현재 사용자 비밀번호
 * @apiParam {String} [new_password] 변경할 사용자 비밀번호
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
 *
 * @apiError Bad Request 패스워드 불일치로 인한 에러.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "meta": {
 *         "status": 400,
 *         "error": "invalid_password",
 *         "message": "패스워드가 일치하지 않습니다."
 *       }
 *     }
 */
export async function putUsers(req, res) {
  const userId = req.user._id;
  const currentPassword = req.body.current_password;
  const newPassword = req.body.new_password;

  let user;
  try {
    user = await Users.findOne({_id: new mongoose.Types.ObjectId(userId)});
  } catch (e) {
    res.status(500).json({
      meta: {
        status: 500,
        error: 'database_find_error',
        message: e.toString()
      }
    });
  }

  // 패스워드 변경 시
  if (currentPassword && newPassword) {
    if (!user.comparePassword(currentPassword))
      return res.status(400).json({
        meta: {
          status: 400,
          error: 'invalid_password',
          message: '패스워드가 일치하지 않습니다.'
        }
      });

    user.password = newPassword;
    user.save()
      .then(() => {
        res.json({
          meta: {
            status: 200
          },
          data: null
        });
      });
  }
}
