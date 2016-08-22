import mongoose from 'mongoose';
import Users from '../models/users';
import Vod from '../models/vods';
import LiveTv from '../models/live-tv';
import Music from '../models/music';
import Review from '../models/review';
import PhotoAlbum from '../models/photo-album';
import Photos from '../models/photos';

// 초기 데이터 입력을 위한 api
const vodDataList = [{
  _id: new mongoose.Types.ObjectId('57149e972b8759bc2c712ce5'),
  categories: [{
    name: 'movies',
    newRank: 1,
    recRank: 1,
    categories: [{
      name: 'action',
      newRank: 1,
      recRank: 1
    }]
  }],
  newRank: 1,
  recRank: 1,
  video: 'http://public.vtouchinc.com/vtv/test.mp4',
  image: 'http://ia.media-imdb.com/images/M/MV5BNTE5NzU3MTYzOF5BMl5BanBnXkFtZTgwNTM5NjQxODE@._V1_.jpg',
  title: 'Batman v Superman',
  subtitle: 'Dawn of Justice',
  rate: 5,
  age: 7,
  story: `모든 대결에는 이유가 있다!
    슈퍼맨과 조드 장군의 격렬한 전투 이후 메트로폴리스는 파괴되었고 슈퍼맨은 세계 최고 논쟁의 인물이 되어버린다.
    한편 배트맨은 그 동안 타락했던 많은 자들처럼 슈퍼맨 역시 언젠가 타락을 할 것이라 생각하며 사회에서 가장 위험한 존재로 여긴다.
    세계의 미래를 위해 무모하고 제어할 수 없는 힘을 가진 슈퍼맨으로 인해 벌어졌던 일들을 바로 잡으려 하는데…`,
  director: ['잭 스나이더'],
  cast: ['헨리 카빌', '벤 애플렉', '에이미 아담스'],
  isNewTag: true,
  isHotTag: false,
  isSaleTag: false,
  time: 151,
  thumbnails: [
    'http://movie.phinf.naver.net/20150710_246/1436502220047G0RYG_JPEG/movie_image.jpg?type=m427_320_2',
    'http://movie.phinf.naver.net/20150710_95/1436502215976qNA0j_JPEG/movie_image.jpg?type=m427_320_2'
  ],
  price: '$5',
  quality: 'UHD',
  expirationDate: 30,
  year: 2016,
  clip: [{
    title: '스토리 예고편',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/29253_20151203034301.gif',
    video: 'http://public.vtouchinc.com/vtv/test.mp4'
  }, {
    title: '2차 예고편',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/27624_20150713095138.gif',
    video: 'http://public.vtouchinc.com/vtv/test2.mp4'
  }, {
    title: '티저 예고편',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/26800_20150420104917.jpg',
    video: 'http://public.vtouchinc.com/vtv/test.mp4'
  }],
  relateContents: ['57149e972b8759bc2c712cea']
}, {
  _id: new mongoose.Types.ObjectId('57149e972b8759bc2c712cea'),
  categories: [{
    name: 'movies',
    newRank: 1,
    recRank: 1,
    categories: [{
      name: 'romance',
      newRank: 2,
      recRank: 3
    }, {
      name: 'drama',
      newRank: 3,
      recRank: 3
    }]
  }, {
    name: 'tv-shows',
    newRank: 2,
    recRank: 6,
    categories: [{
      name: 'drama',
      newRank: 4,
      recRank: 2
    }]
  }],
  newRank: 1,
  recRank: 1,
  video: 'http://public.vtouchinc.com/vtv/test2.mp4',
  image: 'http://ia.media-imdb.com/images/M/MV5BMjI5OTYzNjI0Ml5BMl5BanBnXkFtZTcwMzM1NDA1OQ@@._V1_.jpg',
  title: 'Man of Steel',
  rate: 4.83,
  age: 12,
  story: `새로운 전설의 시작!
    이제 영웅은 달라져야 한다!
    무차별적인 자원 개발로 멸망위기에 처한 크립톤 행성. 행성 최고의 과학자 조엘(러셀 크로우)은 갓 태어난 아들 칼엘(헨리 카빌)을 지키기 위해 크립톤 행성의 꿈과 희망을 담아 지구로 보낸다.
    자신의 존재를 모른 채 지구에서 클락이라는 이름으로 자란 칼엘은 남들과 다른 능력 때문에 주변 사람들로부터 거부를 당하고, 아버지(케빈 코스트너)로부터 우주에서 온 자신의 비밀을 듣게 되면서 혼란에 빠진다.
    한편, 크립톤 행성의 반란군 조드 장군(마이클 섀넌)은 파괴된 행성을 다시 재건할 수 있는 모든 유전자 정보가 담긴 코덱스가 칼엘에게 있다는 것을 알고 그를 찾아 부하들을 이끌고 지구에 온다. 이제 칼엘은 자신을 거부하던 사람들이 사는 지구의 존폐를 두고 최강의 적 조드 장군과 피할 수 없는 운명의 전쟁을 시작하는데…
    가슴의 ‘S’마크가 뜻하는 ‘희망’의 이름으로, 칼엘은 이제 지구인들이 추구해야 할 이상이며, 사람들이 기적을 만들도록 돕는 수퍼맨으로 거듭난다.`,
  director: ['잭 스나이더'],
  cast: ['헨리 카빌', '에이미 아담스', '러셀 크로우'],
  isNewTag: false,
  isHotTag: false,
  isSaleTag: true,
  time: 143,
  thumbnails: [
    'http://movie.phinf.naver.net/20130404_285/1365061923449CRKqr_JPEG/movie_image.jpg?type=m427_320_2',
    'http://movie.phinf.naver.net/20130527_202/1369618987650gISb6_JPEG/movie_image.jpg?type=m427_320_2',
    'http://movie.phinf.naver.net/20111223_299/13246453931367m19a_JPEG/movie_image.jpg?type=m427_320_2',
    'http://movie.phinf.naver.net/20121228_98/1356681856155ydDSd_JPEG/movie_image.jpg?type=m427_320_2',
    'http://movie.phinf.naver.net/20130605_124/1370419346677c1gTj_JPEG/movie_image.jpg?type=m427_320_2'
  ],
  price: '$16',
  quality: 'FHD',
  expirationDate: 28,
  year: 2013,
  clip: [{
    title: '2차 예고편',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/20177_20130318042149.jpg',
    video: 'http://public.vtouchinc.com/vtv/test.mp4'
  }, {
    title: '1차 예고편',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/20176_20130318041227.jpg',
    video: 'http://public.vtouchinc.com/vtv/test2.mp4'
  }],
  relateContents: ['57149e972b8759bc2c712ce5']
}];

const liveTvDataList = [{
  _id: new mongoose.Types.ObjectId('57149e972b8759bc2c712ce5'),
  categories: [{
    name: 'entertainment',
    hotRank: 1
  }],
  hotRank: 3,
  video: 'http://public.vtouchinc.com/vtv/test.mp4',
  image: 'http://movie.phinf.naver.net/20150710_93/1436502218219AqguW_JPEG/movie_image.jpg?type=m427_320_2',
  title: 'The Voice',
  rate: 4,
  age: 7,
  story: 'Four famous musicians search for the best voices in America and will mentor these singers to become artists. America will decide which singer will be worthy of the grand prize.',
  director: ['잭 스나이더'],
  cast: ['헨리 카빌', '벤 애플렉', '에이미 아담스'],
  isNewTag: true,
  isHotTag: false,
  channel: 17,
  broadcast: 'NBC',
  clip: [{
    title: 'Episode #1',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/29253_20151203034301.gif',
    video: 'http://public.vtouchinc.com/vtv/test.mp4'
  }, {
    title: 'Episode #2',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/27624_20150713095138.gif',
    video: 'http://public.vtouchinc.com/vtv/test2.mp4'
  }, {
    title: 'Episode #3',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/26800_20150420104917.jpg',
    video: 'http://public.vtouchinc.com/vtv/test.mp4'
  }],
  relateContents: ['57149e972b8759bc2c712cea']
}, {
  _id: new mongoose.Types.ObjectId('57149e972b8759bc2c712cea'),
  categories: [{
    name: 'documentary',
    hotRank: 5
  }, {
    name: 'entertainment',
    hotRank: 6
  }],
  hotRank: 3,
  video: 'http://public.vtouchinc.com/vtv/test2.mp4',
  image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/20436_20130419122917.gif',
  title: 'MasterChef Junior',
  rate: 4.77,
  age: 12,
  story: '24 of the best junior home cooks in the country between the ages of eight and 13 will compete in the first audition round and present their dishes to the judges.',
  director: ['잭 스나이더'],
  cast: ['헨리 카빌', '에이미 아담스', '러셀 크로우'],
  isNewTag: false,
  isHotTag: false,
  channel: 71,
  broadcast: 'FOX',
  clip: [{
    title: 'Episode #1',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/20177_20130318042149.jpg',
    video: 'http://public.vtouchinc.com/vtv/test.mp4'
  }, {
    title: 'Episode #2',
    image: 'http://imgmovie.naver.net/multimedia/MOVIECLIP/TRAILER/20176_20130318041227.jpg',
    video: 'http://public.vtouchinc.com/vtv/test2.mp4'
  }],
  relateContents: ['57149e972b8759bc2c712ce5']
}];

const musicDataList = [{
  _id: new mongoose.Types.ObjectId('57149e972b8759bc2c712ce5'),
  categories: [{
    name: 'alternative',
    newRank: 1,
    recRank: 1,
    hotRank: 1
  }],
  newRank: 1,
  recRank: 2,
  hotRank: 3,
  title: 'Stressed Out',
  file: 'http://www.bensound.org/bensound-music/bensound-epic.mp3',
  image: 'http://i1.wp.com/cliffordstumme.com/wp-content/uploads/2015/05/screen-shot-2015-05-28-at-11-55-41-am.png',
  singer: 'Twenty One Pilots',
  album: 'Blurryface',
  lyric: `I wish I found some better sounds no one's ever heard,
    I wish I had a better voice that sang some better words,
    I wish I found some chords in an order that is new,
    I wish I didn't have to rhyme every time I sang,

    I was told when I get older all my fears would shrink,
    But now I'm insecure and I care what people think.

    My name's 'Blurryface' and I care what you think.
    My name's 'Blurryface' and I care what you think.

    Wish we could turn back time, to the good ol' days,
    When our momma sang us to sleep but now we're stressed out.
    Wish we could turn back time, to the good ol' days,
    When our momma sang us to sleep but now we're stressed out.

    We're stressed out.

    Sometimes a certain smell will take me back to when I was young,
    How come I'm never able to identify where it's coming from,
    I'd make a candle out of it if I ever found it,
    Try to sell it, never sell out of it, I'd probably only sell one,

    It'd be to my brother, 'cause we have the same nose,
    Same clothes homegrown a stone's throw from a creek we used to roam,
    But it would remind us of when nothing really mattered,
    Out of student loans and treehouse homes we all would take the latter.

    My name's 'Blurryface' and I care what you think.
    My name's 'Blurryface' and I care what you think.

    Wish we could turn back time, to the good ol' days,
    When our momma sang us to sleep but now we're stressed out.
    Wish we could turn back time, to the good ol' days,
    When our momma sang us to sleep but now we're stressed out.

    We used to play pretend, give each other different names,
    We would build a rocket ship and then we'd fly it far away,
    Used to dream of outer space but now they're laughing at our face,
    Saying, "Wake up, you need to make money."
    Yo.

    We used to play pretend, give each other different names,
    We would build a rocket ship and then we'd fly it far away,
    Used to dream of outer space but now they're laughing at our face,
    Saying, "Wake up, you need to make money."
    Yo.

    Wish we could turn back time, to the good ol' days,
    When our momma sang us to sleep but now we're stressed out.
    Wish we could turn back time, to the good ol' days,
    When our momma sang us to sleep but now we're stressed out.

    Used to play pretend, used to play pretend, bunny
    We used to play pretend, wake up, you need the money
    Used to play pretend, used to play pretend, bunny
    We used to play pretend, wake up, you need the money
    We used to play pretend, give each other different names,
    We would build a rocket ship and then we'd fly it far away,
    Used to dream of outer space but now they're laughing at our face,
    Saying, "Wake up, you need to make money."
    Yo.`
}, {
  _id: new mongoose.Types.ObjectId('57149e972b8759bc2c712cea'),
  categories: [{
    name: 'hip-hop',
    newRank: 1,
    recRank: 1,
    hotRank: 1
  }],
  newRank: 1,
  recRank: 2,
  hotRank: 3,
  title: 'Hotline Bling',
  file: 'http://www.bensound.org/bensound-music/bensound-funnysong.mp3',
  image: 'https://flavorwire.files.wordpress.com/2015/09/748x748sr.jpg',
  singer: 'Drake',
  album: 'Hotline Bling',
  lyric: `You used to call me on my
    You used to, you used to
    Yeah

    You used to call me on my cell phone
    Late night when you need my love
    Call me on my cell phone
    Late night when you need my love
    And I know when that hotline bling
    That can only mean one thing
    I know when that hotline bling
    That can only mean one thing

    Ever since I left the city,
    You got a reputation for yourself now
    Everybody knows and I feel left out
    Girl you got me down, you got me stressed out
    'Cause ever since I left the city,
    you started wearing less and goin' out more
    Glasses of champagne out on the dance floor
    Hangin' with some girls I've never seen before

    You used to call me on my cell phone
    Late night when you need my love
    Call me on my cell phone
    Late night when you need my love
    I know when that hotline bling
    That can only mean one thing
    I know when that hotline bling
    That can only mean one thing

    Ever since I left the city, you, you, you
    You and me we just don't get along
    You make me feel like I did you wrong
    Going places where you don't belong
    Ever since I left the city,
    you, you got exactly what you asked for
    Running out of pages in your passport
    Hanging with some girls I've never seen before

    You used to call me on my cell phone
    Late night when you need my love
    Call me on my cell phone
    Late night when you need my love
    And I know when that hotline bling
    That can only mean one thing
    I know when that hotline bling
    That can only mean one thing

    These days, all I do is
    Wonder if you're bendin' over backwards for someone else
    Wonder if you're rollin' up a backwoods for someone else
    Doing things I taught you, gettin' nasty for someone else
    You don't need no one else
    You don't need nobody else, no
    Why you never alone
    Why you always touching road
    Used to always stay at home, be a good girl
    You was in a zone, yeah
    You should just be yourself
    Right now, you're someone else

    You used to call me on my cell phone
    Late night when you need my love
    Call me on my cell phone
    Late night when you need my love
    And I know when that hotline bling
    That can only mean one thing
    I know when that hotline bling
    That can only mean one thing

    Ever since I left the city`
}];

const reviewDataList = [{
  vodId: '57149e972b8759bc2c712ce5',
  title: 'Surprisingly Well Done',
  rate: 4.5,
  content: 'Now I would say that this movie has slow but steady momentum-building. Effects were believable and not overwhelmingly CGI. It\'s well worth its ticket price.',
  author: 'darkmax'
}, {
  vodId: '57149e972b8759bc2c712ce5',
  title: 'Go in expecting less of DC\'s version of The Avengers and more of a variation on Watchmen.',
  rate: 2.8,
  content: `After three years of intense hype and scrutiny, Batman v Superman: Dawn of Justice (henceforth known as BvS) is finally here. And it’s OK to good with some very fine and some very off-base moments peppered throughout. BvS never fully transcends into being an awesome viewing experience and yet is also too competently made to be anywhere near the disaster its haters have predicted. That said, if you've already made up your mind about BvS then the actual film itself won't do much to change your mind one way or another.
    Part Man of Steel sequel and part Justice League prologue, the Zack Snyder-directed BvS chronicles the violent, early encounters between the Dark Knight (Ben Affleck) and the Man of Steel (Henry Cavill) and their eventual reconciliation to being Super Friends.`,
  author: 'JIM VEJVODA'
}, {
  vodId: '57149e972b8759bc2c712ce5',
  title: '\'Batman v Superman\' is a solid comic-book flick',
  rate: 2,
  content: `In his approach to fighting crime, Batman (Ben Affleck) isn’t particularly fond of restraint — and that has Gotham City’s bad guys terrified. But the Caped Crusader’s zeal in meting out justice has earned him a reputation as a vigilante, and attracted the attention of a reporter who happens to have some issues of his own.
    Clark Kent (Henry Cavill), who works for the Daily Planet in Metropolis, sees Batman not as a kindred spirit but as a dark reflection. As Superman, Kent strives to do the right thing even in the most difficult of circumstances.
    But like Batman, he must deal with public scrutiny — particularly from Senator Finch (Holly Hunter), who questions whether the Man of Steel can be trusted to use his powers responsibly. His rescue of colleague and girlfriend Lois Lane (Amy Adams) from yet another tight spot appears to strengthen Finch’s argument.`,
  author: 'Calvin Wilson St. Louis Post-Dispatch'
}, {
  vodId: '57149e972b8759bc2c712cea',
  title: 'Zack Snyder and Christopher Nolan have reimagined Superman on a grandiose scale for the 21st century. But what about the innocent pleasures of the original character?',
  rate: 3,
  content: 'It must be the last act of superhero revisionism: abolishing the word "super". In this new movie directed by Zack Snyder, and produced and co-written by Christopher Nolan, the letter on our hero\'s chest doesn\'t mean what we all thought it meant. This is no English S, but a Krypton symbol denoting hope. The word "Superman" is stutteringly or suspiciously pronounced, like "the bat man" in the Dark Knight movies. He is referred to by his earthling name, Clark, or his Krypton name, Kal-El, or even as the "alien", by the frowning Pentagon brass. This is a 21st-century superhero who must steel himself against the agonies of being misunderstood by the people he is trying to help.',
  author: 'Peter Bradshaw'
}, {
  vodId: '57149e972b8759bc2c712cea',
  title: 'Who the f cares about the critics?',
  rate: 4.3,
  content: `I know what the critics has said. They complained about too much action, superman being too serious, lack of romance, etc. Since Zack Snyder directed this movie, I don't think he cared about the critics. Don't get me wrong, he DOES care about the fans' opinion. Seems like he really wanted to really satisfy the fans. I see why critics complained about too much action. For me it's just his way to satisfy the viewers. This is the kind of movie that is just really satisfying. When the movie ended, I got that 'satisfying' feeling instead of the 'wanting more' feeling. It's like it was really enough.
    Even Snyder's best movies (before this) which were 300 & Watchmen didn't have more ratings than 64% on Rotten Tomatoes. I think the fans should have anticipated the bad reviews. His style is actually what critics hate. The over the top action and CGI is actually his trademark. So, even from the beginning, I think this is actually the kind of movie the producers wanted. About the lack of romance, I really do think it's saved for the sequel. The sequel will definitely explore more about the relationship between Clark and Lois. This film focused on 2 aspects: the origin (krypon,struggle finding his place) & the action (Zod and his army). Don't expect humor or romance.
    The visuals were spectacular! What's best about this movie is its action scenes. The action were just relentless. I think the fans would not be disappointed at all. Yes, I know there is only a very few humor this movie but that actually doesn't even matter. The battle between Superman & Zod will definitely 'wow' everyone but the critics. I mean who cares about the critics opinion? A superhero movie MUST NOT be judged by the critics opinion, what's more important is the audience's opinion about the movie and especially the fans'. I think the movie really delivered. Most people will definitely like this movie. I am really sure that many fanboys will consider this as the best comic book of all time. This is a MUST SEE for people who like action movie. The action were better than last year's The Avengers.
    The sequel really have a great potential. Considering the minimum amount of romance in this movie (since they just knew each other, and superman was also more focused on Zod), the next movie could explore more of that. One of the things missing from the movie was also the presence of Clark Kent at the daily planet. It's one of the trade marks. But, I believe the sequel will show more scenes in the Daily Planet which is interesting to see.
    As a conclusion, I think Man of Steel is so far the best action movie this year. This movie really is a Snyder movie. But it also has a quite lot of nolan-esque feel to it especially in the around first 45 minutes.`,
  author: 'lyre'
}, {
  vodId: '57149e972b8759bc2c712cea',
  title: 'Even for Marvel fans this is a must GO!',
  rate: 4.9,
  content: `The trailers of this movie were released in a so effective way that you start to fear if the product will fill your expectations. And with the usual critics-know-about-everything-nothing-is-good- to-me reviews the chances of be confused about this are increasing. As high as the expectations were raised after trailers, i have to tell you that you will not disappointed with this movie. Is different in many ways to the usual superhero movies but is a solid product that fits in what you expect from this kind of film. Nice references to previous movies are well executed and new plot additions are well received too. As you can expect from a Zack Snyder movie, there are several scenes that try to resemble graphic novel arts and in my opinion are very well made. Some of the nicest things about this movie is the way they made the fast moving scenes. The most of them (unfortunately i can't say all of them) look very realistic according laws of physics, the CGI are so well made that you wish that development for many movies you seen before. The movements are what you expect if such kind of people exist in reality.
    About the plot, i believe this is the more controversial point of what i see in reviews across the internet. Most moviegoers like it a lot, but are critics the ones ( not all of them) that are giving mixed reviews. What you realize is that critics expect another Dark Knight but this movie is not looking to be a darker one of your beloved Superman. If you are smart enough to understand that this is ANOTHER hero you will be happy with the story. If you are looking for a fourth darker than Batman movie for sure you will agree with critics giving bad reviews. This is a Superman movie and in that scenario this is a very good one.`,
  author: 'Luis Eduardo Moreno'
}];

const photoAlbumDataList = [{
  group: 'Family Album',
  album: 'Cloud Album',
  image: 'http://public.vtouchinc.com/vtv/photo/test-thumb/0.JPG',
  isNewTag: true
}, {
  group: 'Family Album',
  album: 'Panorama',
  image: 'http://public.vtouchinc.com/vtv/photo/test-thumb/1.JPG',
  isNewTag: true
}, {
  group: 'Family Album',
  album: 'Judy\s Smart Phone',
  image: 'http://public.vtouchinc.com/vtv/photo/test-thumb/2.JPG',
  isNewTag: false
}, {
  group: 'Family Album',
  album: 'Tom\'s Notebook',
  image: 'http://public.vtouchinc.com/vtv/photo/test-thumb/3.JPG',
  isNewTag: false
}, {
  group: 'Family Album',
  album: 'Oracle\'s Notebook',
  image: 'http://public.vtouchinc.com/vtv/photo/test-thumb/4.JPG',
  isNewTag: false
}];

const photoDataList = [{
  group: 'Family Album',
  album: 'Cloud Album',
  thumb: 'http://public.vtouchinc.com/vtv/photo/test-thumb/0.JPG',
  image: 'http://public.vtouchinc.com/vtv/photo/test/0.JPG'
}, {
  group: 'Family Album',
  album: 'Cloud Album',
  thumb: 'http://public.vtouchinc.com/vtv/photo/test-thumb/1.JPG',
  image: 'http://public.vtouchinc.com/vtv/photo/test/1.JPG'
},{
  group: 'Family Album',
  album: 'Cloud Album',
  thumb: 'http://public.vtouchinc.com/vtv/photo/test-thumb/2.JPG',
  image: 'http://public.vtouchinc.com/vtv/photo/test/2.JPG'
},{
  group: 'Family Album',
  album: 'Cloud Album',
  thumb: 'http://public.vtouchinc.com/vtv/photo/test-thumb/3.JPG',
  image: 'http://public.vtouchinc.com/vtv/photo/test/3.JPG'
},{
  group: 'Family Album',
  album: 'Cloud Album',
  thumb: 'http://public.vtouchinc.com/vtv/photo/test-thumb/4.JPG',
  image: 'http://public.vtouchinc.com/vtv/photo/test/4.JPG'
},{
  group: 'Family Album',
  album: 'Cloud Album',
  thumb: 'http://public.vtouchinc.com/vtv/photo/test-thumb/5.JPG',
  image: 'http://public.vtouchinc.com/vtv/photo/test/5.JPG'
},{
  group: 'Family Album',
  album: 'Cloud Album',
  thumb: 'http://public.vtouchinc.com/vtv/photo/test-thumb/6.JPG',
  image: 'http://public.vtouchinc.com/vtv/photo/test/6.JPG'
}, {
  group: 'Family Album',
  album: 'Panorama',
  thumb: 'https://c8.staticflickr.com/3/2824/11859561023_2a293d3a0f_h.jpg',
  image: 'https://c8.staticflickr.com/3/2824/11859561023_2a293d3a0f_h.jpg'
}, {
  group: 'Family Album',
  album: 'Panorama',
  thumb: 'https://c3.staticflickr.com/8/7283/26833502786_798f6a53e4_z.jpg',
  image: 'https://c3.staticflickr.com/8/7283/26833502786_798f6a53e4_z.jpg'
}, {
  group: 'Family Album',
  album: 'Panorama',
  thumb: 'https://c7.staticflickr.com/8/7375/26837423486_0befeee248_z.jpg',
  image: 'https://c7.staticflickr.com/8/7375/26837423486_0befeee248_z.jpg'
}, {
  group: 'Family Album',
  album: 'Judy\s Smart Phone',
  thumb: 'https://c1.staticflickr.com/3/2864/10074726304_bd8343f80b_b.jpg',
  image: 'https://c1.staticflickr.com/3/2864/10074726304_bd8343f80b_b.jpg'
}, {
  group: 'Family Album',
  album: 'Judy\s Smart Phone',
  thumb: 'https://c8.staticflickr.com/4/3901/14978513975_f9861ec88a_c.jpg',
  image: 'https://c8.staticflickr.com/4/3901/14978513975_f9861ec88a_c.jpg'
}, {
  group: 'Family Album',
  album: 'Judy\s Smart Phone',
  thumb: 'https://c1.staticflickr.com/2/1548/26283314600_e67b63e817_z.jpg',
  image: 'https://c1.staticflickr.com/2/1548/26283314600_e67b63e817_z.jpg'
}, {
  group: 'Family Album',
  album: 'Tom\'s Notebook',
  thumb: 'https://c4.staticflickr.com/1/8/12764523_1653775bed_b.jpg',
  image: 'https://c4.staticflickr.com/1/8/12764523_1653775bed_b.jpg'
}, {
  group: 'Family Album',
  album: 'Tom\'s Notebook',
  thumb: 'https://c1.staticflickr.com/4/3896/15110568240_9984af3ccb_b.jpg',
  image: 'https://c1.staticflickr.com/4/3896/15110568240_9984af3ccb_b.jpg'
}, {
  group: 'Family Album',
  album: 'Tom\'s Notebook',
  thumb: 'https://c1.staticflickr.com/9/8001/7499966760_6c8c8a8994_c.jpg',
  image: 'https://c1.staticflickr.com/9/8001/7499966760_6c8c8a8994_c.jpg'
}, {
  group: 'Family Album',
  album: 'Oracle\'s Notebook',
  thumb: 'https://c1.staticflickr.com/6/5260/5478367192_a2f163937b_b.jpg',
  image: 'https://c1.staticflickr.com/6/5260/5478367192_a2f163937b_b.jpg'
}, {
  group: 'Family Album',
  album: 'Oracle\'s Notebook',
  thumb: 'https://c7.staticflickr.com/4/3786/11777928286_442e073554_c.jpg',
  image: 'https://c7.staticflickr.com/4/3786/11777928286_442e073554_c.jpg'
}, {
  group: 'Family Album',
  album: 'Oracle\'s Notebook',
  thumb: 'https://c4.staticflickr.com/8/7650/26800388331_46d739c7ca_z.jpg',
  image: 'https://c4.staticflickr.com/8/7650/26800388331_46d739c7ca_z.jpg'
}];

const initialUsers = [{
  email_address: 'se@vtouch.kr',
  password: '1234'
}, {
  email_address: 'test@vtouch.kr',
  password: 'test'
}];


export async function getInit(req, res) {
  const users = await Users.find();
  if (!users.length) {
    for (let userDoc of initialUsers) {
      const user = new Users(userDoc);
      user.save(err => {
        if (err) throw err;
      });
    }
  }

  const vodList = await Vod.find();
  if (!vodList.length) {
    for (let mediaData of vodDataList) {
      const media = new Vod(mediaData);
      media.save(err => {
        if (err) throw err;
      });
    }
  }

  const liveTvList = await LiveTv.find();
  if (!liveTvList.length) {
    for (let mediaData of liveTvDataList) {
      const media = new LiveTv(mediaData);
      media.save(err => {
        if (err) throw err;
      });
    }
  }

  const musicList = await Music.find();
  if (!musicList.length) {
    for (let mediaData of musicDataList) {
      const media = new Music(mediaData);
      media.save(err => {
        if (err) throw err;
      });
    }
  }

  const reviewList = await Review.find();
  if (!reviewList.length) {
    for (let reviewData of reviewDataList) {
      const media = new Review(reviewData);
      media.save(err => {
        if (err) throw err;
      });
    }
  }

  const photoAlbumList = await PhotoAlbum.find();
  if (!photoAlbumList.length) {
    for (let photoAlbumData of photoAlbumDataList) {
      const photoAlbum = new PhotoAlbum(photoAlbumData);
      photoAlbum.save(err => {
        if (err) throw err;
      });
    }
  }

  const photosList = await Photos.find();
  if (!photosList.length) {
    for (let photosData of photoDataList) {
      const photo = new Photos(photosData);
      photo.save(err => {
        if (err) throw err;
      });
    }
  }

  res.status(200).json({
    result: 'success'
  });
}
