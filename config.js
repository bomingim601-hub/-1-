/* =====================================================
   ★ 사진 / 소리 자리 (여기만 보면 돼) ★
   - 사진은 images 폴더에 넣고, 아래 파일 이름만 맞추면 자동으로 바뀌어.
   - 같은 이름으로 덮어쓰기만 해도 돼 (코드 수정 필요 없음).
   - 파일이 없으면 회색 자리표시가 나와서 게임은 안 멈춰.
   ===================================================== */
const IMG = {
  /* 배경 */
  interviewBg: "interview-bg.jpg",     // 1일차 인터뷰 배경 (베이지)
  lastChatBg:  "lastchat-bg.jpg",      // 4일차 X와 마지막 대화 배경 (거실)

  /* 편지 (1일차 X소개서 / 4일차 X룸 같이 사용) */
  envelope:    "envelope.jpg",
  letterPaper: "paper.jpg",

  /* X룸 */
  cork:        "cork.jpg",
  linedPaper:  "paper.jpg",
  polaroid1:   "polaroid1.jpg",        // 음식 먹는 대영
  polaroid2:   "polaroid2.jpg",        // 소파에서 잠든 대영
  polaroid3:   "polaroid3.jpg",        // 바닷가 뒤돌아보는 대영
  polaroid4:   "polaroid4.jpg",        // 네 컷 사진 (세로로 긴 사진은 자동으로 안 잘림)
  polaroid5:   "polaroid5.jpg",        // 따뜻한 음료 든 대영
  ring:        "obj-ring.png",
  keyring:     "obj-keyring.png",
  mug:         "obj-mug.png",
  drawer:      "drawer.png",         // 협탁(서랍장)
  clothespin:  "clothespin.png",     // 폴라로이드 집게
  scarf:       "obj-scarf.png",

  /* 핸드폰 */
  homeWallpaper: "",                          // 홈 화면 배경 (비우면 검정)
  lockWallpaper: "lock-wallpaper.jpg", // 히든 "몇 달 뒤" 잠금화면 (남성 뒷모습)
  iconCall:    "icon-call.webp",
  iconMsg:     "icon-msg.webp",
  iconMemo:    "icon-memo.webp",

  /* 트위터(X) 계정별 프사 (고정). id를 비워두면 영어 아이디 자동 */
  twFixed: {
    "입력해주세요":      {id:"p1easenter", av:"av/p1easenter.jpg"},
    "환연보는계":       {av:"av/rose-boy.jpg"},
    "ㅇㅇ":          {av:"av/default.jpg"},
    "ま(しめ)ろ":      {id:"meroniams", av:"av/meroniams.jpg"},
    "장점잉잉":        {av:"av/letter-s.jpg"},
    "미니쿠리얌":       {av:"av/white-bear.jpg"},
    "짱짱":          {id:"Yezzzan9", av:"av/yezzzan9.jpg"},
    "유댕이":         {av:"av/seal.jpg"},
    "굥":           {av:"av/cream-dog.jpg"},
    "걍사귀라고햇잖아":    {av:"av/gun-girl.jpg"},
    "대대♥":         {av:"av/sarang.jpg"},
    "yushi_archive": {av:"av/letter-y.jpg"},
    "오니온오디온":      {av:"av/pixel-pray.jpg"},
    "마이러뷰":        {av:"av/glasses-girl.jpg"},
    "난이미이걸좋아해":    {av:"av/bunny-glasses.jpg"},
    "관찰중":         {av:"av/doll.jpg"},
    "걍울고있음":       {av:"av/crying-draw.jpg"},
    "우리집연프방":      {av:"av/polka-heart.jpg"},
    "유댕이기다려":      {av:"av/bear-yellow.jpg"},
    "연애는어려워":      {av:"av/crying-bear.jpg"},
    "다음화주세요":      {av:"av/drawn-dog.jpg"},
    "환승연애과몰입중":    {av:"av/bear-beige.jpg"},
    "유재회":         {av:"av/bunny-glasses.jpg"},
    "오빠그말진짜야":     {av:"av/crying-bear.jpg"},
    "유우시의콧구멍":     {av:"av/drawn-dog.jpg"},
    "음버":          {av:"av/pixel-pray.jpg"},
    "우리다시만나":      {av:"av/sarang.jpg"},
    "국밥먹고뽀뽀해":     {av:"av/cream-dog.jpg"},
    "환승연애최종회기다림":  {av:"av/polka-heart.jpg"},
    "둘이행복해줘제발":    {av:"av/bear-yellow.jpg"}
  },

  /* 유우시 인스타 */
  yushiProfile: "yushi-profile.jpg",
  insta: [                                    // 피드 사진 (6장까지 넣을 수 있어. 지금은 4장)
    "insta1.jpg",
    "insta2.jpg",
    "insta3.jpg",
    "insta4.jpg"
    // ,"insta5.jpg", "insta6.jpg"
  ]
};

const SOUND = {
  ding: "ding.mp3"    // 알람 효과음. 파일이 없으면 기본 '띵' 소리가 대신 나와
};

const SETTINGS = {
  hiddenIdleSeconds: 10,     // 성공엔딩에서 가만히 두면 히든이 나오는 시간(초)
  endingTitle: "해피엔딩",
  endingText:  "대영과 유우시는 서로의 손을 잡고 함께 프로그램을 나갑니다.",
  badTitle:    "새로운 시작",
  badText:     "대영은 유우시와 서로의 인생에서 오래 기억될 사람으로 남은 채, 새로운 시작을 맞이합니다."
};
