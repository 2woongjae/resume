export default (url) => {
  if (!url) return null;
  return url.replace('https://s3.ap-northeast-2.amazonaws.com/vtouch/hospital_run/content/', '');
}
