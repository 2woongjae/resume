// 공통 설정
export const server = {
  port: process.env.PORT || 3000
};
export const jwtSecretKey = 'vtouch-kingofkings-man-2woongjae!';
export const awsOptions = {
  region: 'ap-northeast-2'
};
const sharedConfig = {
  server,
  jwtSecretKey,
  awsOptions
};

// 개발 환경 config
const devlopment = {
  ...sharedConfig,
  dbUri: 'mongodb://ds015750.mlab.com:15750/vtv-dev',
  dbOptions: {
    user: 'dev',
    pass: 'dev',
    numberOfRetries: 30,
    retryMiliSeconds: 1000
  }
};

// 프로덕션 환경 config
const production = {
  ...sharedConfig,
  dbUri: 'mongodb://mongodb3.vtouch.local/vtv',
  dbOptions: {
    numberOfRetries: 30,
    retryMiliSeconds: 1000
  }
};

const config = {
  devlopment,
  production
};

const isDeveloping = !(process.env.NODE_ENV || '').includes('production');
export default config[isDeveloping ? 'devlopment' : 'production'];
