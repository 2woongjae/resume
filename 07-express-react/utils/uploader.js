import moment from 'moment';
import store from 'store';
import toastr from 'toastr';

// 랜덤 hash data 생성
export const generateUUID = () => (
  ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
);

// 랜덤한 4자리 data + hash 파일 이름 생성
export const generateFileName = (filename) => (
  `${moment().format('YYYYMMDD')}-${+moment()}-
  ${generateUUID()}.
  ${filename.split('.').pop()}`.replace(/\s/g, '')
);

// Uploader private properties
const _onProgress = Symbol('onProgress');
const _onComplete = Symbol('onComplete');

/* 파일 업로더
* (file: File object, container: s3 container name)
* example:
* const uploader = new Uploader(file, '/vods/57149e972b8759bc2c712ce5')
*/
export default class Uploader {
  constructor(file, container) {
    container = container.startsWith('/') ?
      container.replace('/', '') : container;
    container = container ?
      (container.endsWith('/') ? container : `${container}/`) : '';

    this.file = file;
    this[_onProgress] = null;
    this[_onComplete] = null;

    const xhr = new XMLHttpRequest();
    const filename = `${container}${generateFileName(file.name)}`;
    let progress = 0;

    fetch(`/api/s3handler?filename=${filename}&filetype=${file.type}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.get('token')}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.meta.error)
          throw new Error(res.meta.message);

        xhr.upload.onprogress = e => {
          if (!e.lengthComputable || !this[_onProgress]) return;
          progress = parseInt((e.loaded / e.total) * 100, 10);
          this[_onProgress](progress);
        };
        xhr.onload = () => {
          if (xhr.status !== 200) return;

          // 업로드된 url 업데이트
          const url = res.data.url.replace('https://s3.ap-northeast-2.amazonaws.com/', 'http://');
          // 업로드 전체 완료 시 callback 호출
          if (this[_onComplete]) this[_onComplete](url);
        };
        xhr.onerror = () => {
          toastr.error('파일을 업로드할 수 없습니다');
        };
        xhr.open('PUT', res.data.signed_request);
        xhr.send(file);
      })
      .catch(error => toastr.error(error));
  }

  onProgress (callback) {
    this[_onProgress] = callback;
  };

  onComplete (callback) {
    this[_onComplete] = callback;
  };
}
