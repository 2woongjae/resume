import express from 'express';
import expressJwt from 'express-jwt';
import { jwtSecretKey } from '../config';
import { postLogin } from './auth';
import { postUsers, putUsers } from './users';
import {
  getVodList, getVod, postVod, putVods, putVod, deleteVod
} from './vods';
import {
  getLiveTvList, getLiveTv, postLiveTv, putLiveTvs, putLiveTv, deleteLiveTv
} from './live-tv';
import {
  getMusicList, getMusic, postMusic, putMusics, putMusic, deleteMusic
} from './music';
import {
  getReviewList, getReview, postReview, putReviews, putReview, deleteReview
} from './review';
import {
  getPhotoAlbumList, getPhotoAlbum, postPhotoAlbum,
  putPhotoAlbums, putPhotoAlbum, deletePhotoAlbum
} from './photo-album';
import {
  getPhotoList, getPhoto, postPhoto, putPhotos, putPhoto, deletePhoto
} from './photos';
import {
  getSearchList
} from './search';
import { getS3handler } from './prepare-upload';
import { getInit } from './init';

const jwt = expressJwt({secret: jwtSecretKey});

export default express()
  .post('/auth/login', postLogin)
  .post('/users', jwt, postUsers)
  .put('/me', jwt, putUsers)

  .get('/vods', getVodList)
  .get('/vods/:vodId', getVod)
  .post('/vods', jwt, postVod)
  .put('/vods', jwt, putVods)
  .put('/vods/:vodId', jwt, putVod)
  .delete('/vods/:vodId', jwt, deleteVod)

  .get('/live-tv', getLiveTvList)
  .get('/live-tv/:liveTvId', getLiveTv)
  .post('/live-tv', jwt, postLiveTv)
  .put('/live-tv', jwt, putLiveTvs)
  .put('/live-tv/:liveTvId', jwt, putLiveTv)
  .delete('/live-tv/:liveTvId', jwt, deleteLiveTv)

  .get('/music', getMusicList)
  .get('/music/:musicId', getMusic)
  .post('/music', jwt, postMusic)
  .put('/music', jwt, putMusics)
  .put('/music/:musicId', jwt, putMusic)
  .delete('/music/:musicId', jwt, deleteMusic)

  .get('/review', getReviewList)
  .get('/review/:reviewId', getReview)
  .post('/review', jwt, postReview)
  .put('/review', jwt, putReviews)
  .put('/review/:reviewId', jwt, putReview)
  .delete('/review/:reviewId', jwt, deleteReview)

  .get('/photo-album', getPhotoAlbumList)
  .get('/photo-album/:photoAlbumId', getPhotoAlbum)
  .post('/photo-album', jwt, postPhotoAlbum)
  .put('/photo-album', jwt, putPhotoAlbums)
  .put('/photo-album/:photoAlbumId', jwt, putPhotoAlbum)
  .delete('/photo-album/:photoAlbumId', jwt, deletePhotoAlbum)

  .get('/photos', getPhotoList)
  .get('/photos/:photoId', getPhoto)
  .post('/photos', jwt, postPhoto)
  .put('/photos', jwt, putPhotos)
  .put('/photos/:photoId', jwt, putPhoto)
  .delete('/photos/:photoId', jwt, deletePhoto)

  .get('/search', getSearchList)

  .get('/s3handler', jwt, getS3handler)
  .get('/init', getInit)
  .get('/check', (req, res) => res.json({check: 'Ok'}))
  .use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({
        meta: {
          status: 401,
          error: 'auth_error',
          message: 'No authorization token was found'
        }
      });
    }
  });
