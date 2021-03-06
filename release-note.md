# bolier

### 2021-08-30

     - 좋아요 비활성화 API 개발

### 2021-09-01

     - 게시글 상세내용 가져오기 API 수정
          - 좋아요 누른 상태면 IsLike true
          - 좋아요 비활성화시 IsLike false
     - 댓글 스키마 생성
     - 댓글 생성하기 API 개발
          - 생성후 그 해당 댓글 바로 찾아서 반환
          - 해당 게시글에 댓글 생성시 게시글 댓글수 증가

### 2021-09-04

     - 자동화 배포 시스템 설정 완료
          -AWS 구성
               - IAM 키 생성 후 파일 다운
               - ec2(보안그룹,rds보안그룹)
               - s3 버킷생성
               - rds(서브넷,파라미터생성) 데이터 생성
               - codeDeploy
                    - 애플리케이션, 배포그룹 생성
          - dockerfile
          - docker-compose.yml
          - travis.yml
               - 환경변수 최종 설정 이후 깃 푸쉬
          - appspec.yml
               - 깃푸쉬이후 s3파일을 ec2로 가져가서 deploy.sh 실행
          - execute-deploy.sh
               - ec2 에서 실행될 명령어 입력
     - 로깅 설정 완료
          - winston , morgan
               - api 실행시 err ,info 정보들 자동 저장

### 2021-09-05

     - 댓글, 좋아요 모델 수정
          -좋아요 활성화 API 수정, 댓글 작성하기 API 수정에 따른 필드 수정
     - 좋아요 활성화 API 수정
          - 댓글 , 게시글 어느 부분에 따라 좋아요 수 올라가게 하기위해 로직 수정
     - 댓글 작성하기 API 수정
          - 대댓글, 게시글의 댓글 구분에 따른 로직 개선

### 2021-09-05

     - 카카오 Oauth 기능 구현
          - 미들웨어 생성
     - 구글 Oauth 기능 구현
          - 미들웨어 생성
     - 기존에 있던 인증 미들웨어 로직 개선

### 2021-09-06

     - 이미지 업로드 API 개발
          - 이미지,영상 업로드 최대 10개
     - 전체페이지 정렬
          - formater 모듈 이용

### 2021-09-08

     - 이메일 인증 API 개발
          - 배포용으로 조금 디자인화 시켜서 만들 필요가있다 **
     - 비밀번호 변경 API 개발

### 2021-09-11

     - typeOrm(mysql) => mongoose
          - 아직 rds 연동중
     - 전체 페이지 코드 정렬
          - npm run format
     - 도커 버전 관리
          - 0.0 => 0.5

### 2021-09-12

     - 미들웨어 인증 로직 개선
          - email 로 받아서 repository 에서 유저 찾기 => 미들웨어에서 email을 받으면 유저 찾기
     - User 모델 개선
          - 포인트 개념, 팔로우 개념 으로 인한 필드 추가
     - 유저 팔로우 API 개발
     - 유저 언팔로우 API 개발

### 2021-09-13

     - 팔로우한 유저들 게시글 가져오기 API 개발

### 2021-09-16

     - oAuth 기능 추후 개발 진행으로 미뤄둠
          - 카카오, 구글
     - User 모델 수정
          - 승인 상태확인 필드
          - 결제 수단 필드

### 2021-09-20

     - 회원가입 API 수정
          - email 중복시 에러 처리
          - 비밀번호 조건 수정

### 2021-09-22

     - 스웨거 API 문서화 돌입
          - 현재까지 API 전부 문서화

### 2021-09-28

     - err 코드 리턴시 json으로 넘어오게 수정
          - 로그인 API
          - 회원가입 API
     - 프론트 hoc auth 구현을 위한 auth API 개발
     - 로그아웃 API 개발

### 2021-10-02

     - 사용자 제외한 유저들 가져오기 API 개발

### 2021-10-05

     - 에러 코드 반환을 위한 return 값 변경
          - 비밀번호 변경햐기API
          - 이메일 인증하기 API
          - 좋아요 API
          - 좋아요 비활성화 API

### 2021-10-06

     - 좋아요 데이터 가져오기 API 개발
          - front 단에서 테스트 하기위해 임시적인 API or 진짜 사용할수도있다

### 2021-10-07

     - 팔로우 게시글 가져오기 API 수정
          - err 코드 return 으로인한 return 지정값 삭제

### 2021-10-09

     - 이미지 업로드 API 수정
          - 프론트에서 s3파일 삭제를 위한 return 값 변경

### 2021-10-11

     - 게시글 작성하기 API 수정
          - tag 개수 에러처리
     - 팔로우한 유저 게시글 가져오기 API 수정
          - 자신의 게시글도 가져오게 수정
          - 팔로우한 유저의 private 게시글 안보이게 수정
     - 좋아요 전체 가져오기 API 삭제

### 2021-10-18

     - Tag 데이터들 따로 도큐멘트 만들어서 저장
          - 게시글 작성하기 API 수정
          - 게시글 수정하기 API 수정
     - 댓글 가져오기 API 수정
          - 더보기 기능 구현

### 2021-10-22

     - 자신의 게시글 가져오기 API 개발
     - 회원가입 API 수정
          - 유저 이름 중복 err 처리

### 2021-10-24

     - 유저 모델 변경
          - 사용자 설명 모델 추가
          - 팔로워 유저 목록 모델 추가
     - 에러 코드 반환을 위한 return 값 변경
          - 유저 팔로우 API 수정
               -  유저 팔로우시 팔로우 한 유저 팔로잉에 사용자 추가
          - 유저 언팔로우 API 수정
               -  유저 언팔로우시 언팔로우 한 유저 팔로잉에 사용자 제거

### 2021-10-30

     - 도커 버전 0.5 => v1 업그레이드
     - 언팔로우 API 수정
          - err 처리를 위한 return 값 변경
     - 댓글 가져오기 API 수정
          - 리밋에의해 가져오는 댓글에 대댓글도 포함해서 가져오기

### 2021-11-08

     - 자신의 게시글 가져오기 API 수정
          - 자신의 게시글일땐 public, private 상관없이 다가져오기
          - 상대방 게시글일땐 public 만 가져오기
     - 전체 게시글 가져오기 API 수정
          - 상대방 게시글일땐 public 만 가져오고 자신의 게시글일땐 public,private 둘다 가져오기
     - 프로필 사진 업로드 API 개발
     - lb 대상그룹 헬스체크를 위한 API 개발

### 2021-11-13

     - 댓글 삭제하기 API 개발
     - 나의 게시글 가져오기 API 수정
          - 삭제된 게시글 가져오지 않기

### 2021-11-16

     - 실시간 채팅앱을 위한 socket.io 기술검토

### 2021-11-17

     - socket.io 연동 완료
          - 테스트 진행중

### 2021-11-18

     - 실시간 채팅 구현
          - 같은 채팅방에서 상대방이 나가도 메세지 유지
               - 상대방이 다시 들어오면 상대방은 메세지 초기화

### 2021-11-20

     - 실시간 채팅구현
          - 채팅 룸 만들기
          - 메세지 보내기
          - 메세지 삭제하기
          - 채팅룸 메세지 전체 가져오기
          - 채팅방 나가기(예정)

### 2021-11-21

     - 스웨거 API Tags 추가 작업
     - 회원가입 API 수정
          -  이메일 정규식 추가
     - 채팅방 생성하기 API 수정
          - 나갔엇던 해당 유저가 채팅방 재접속시 leave 데이터에서 제거
     - 채팅방 나가기 API 개발

### 2021-11-23

     - 해당 채팅방 메세지 전체가져오기 API 수정
          - 나간 유저가 없으면 전체 dms 가져오기
          - 나가고 다시들어온유저는 나간 날짜 이후에 메세지 가져오기
          - 다 나가고 다시 채팅시 채팅방 나간 날짜 이후에 메세지 가져오기

### 2021-11-24

     - DMS 디렉토리 DTO 리펙토링 작업 완료

### 2021-11-25

     - 중복코드 제거로 인한 DTO 부분 리펙토링
          - User, board 디렉토리 Dto 리펙토링 완료

### 2021-11-26

     - 사전과제로 진행 test

### 2021-12-17

     - socket 중간점검후 git push
     - 약 한달좀 안되게 갠프를 못했다.. 토스 과제로 인해 기본개념 과 알고리즘 여러가지를 공부하게되면서
     계속 엮이는 지식들을 또 공부를 하다보니 시간이 조금 흘렀다. 이제부터 다시 시작해야겠다.!
     우선은 리펙토링후에 다시 개발을 진행할 예정이다!

### 2021-12-27

     - 해당 err 들 return => throw 로 변환
     - 요번엔 워시스왓 과제로인해 약 일주일 넘게 프로젝트 진행을 못했다. 내일 부터 다시 시작해야겠다.

### 2021-12-28

     - TypeGuard 적용
          - auth Repository 완료 후에 auth services 진행중

### 2022-01-27

     - 게시글 좋아요비활성화 이슈발견 
          - 좋아요 취소시 like데이터가 삭제가 안되고있어서 삭제시켜주므로써 이슈해결

### 2022-01-28

     - 해당 API들 TypeGuard 적용 완료
     - err 로깅 커스텀

### 2022-01-29

     - 서버 arch 구조 개선
     - exception 미들웨어 구현

### 2022-01-30
     
     - success wrapper 구현

### 2022-02-03

     - AUTH 미들웨어 수정
          - user 데이터를 확인 시켰는데 토큰 유무만 확인
               -  DB 부하 방지
     - follow API 비즈니로직 서비스컴포넌트로 옮기는 작업완료
          - 테스트 필요

### 2022-02-04

     - follow API 테스트 완료 
     - unFollow API 비즈니스 로직 분리 완료
     - user api dao 부분 한번더 검토 필요

### 2022-02-05

     - auth api 비즈니스로직 분리 작업 완료
     
### 2022-02-06

     - board API 비즈니스 로직 분리
          - createBoard api
          - followBoard api
     - auth API auth 미들웨어 수정으로 인해 req.user => req.email 으로 변경

### 2022-02-07

     - getMyBoard API 비즈니스 로직 분리

### 2022-02-09

     - getBoards API 비즈니스 로직 분리

### 2022-02-10

     - getDetailBoard API 비즈니스 로직 분리

### 2022-02-11

     - updateBoard API 비즈니스 로직 분리

### 2022-02-12

     - auth 미들웨어 수정
          - req.email => req.userId
               - DB 부하를 줄이기위함

### 2022-02-13

     - deleteBoard API 비즈니스로직 분리
     - like API 비즈니스 로직 분리

### 2022-02-14

     - unLike API 비즈니스 로직 분리
     - create 쿼리문 에 save 메서드 삭제
     - createReply API 비즈니스 로직 분리

### 2022-02-15

     - getReply API 비즈니스 로직 분리
          - test 필요

### 2022-02-16

     - getReply 이슈발견
          - parentId 가 null 인것만 불러와지는데 front에서 어떻게 로직을 짜놨는지 정확히 기억이안난다.
          - boardId 에 해당하는 reply 다불러와서 front에서 로직을 짜는형태로 API 를 개선시켰다.
     - createReply 수정
          - 대댓글 달때 댓글이 삭제된상태면 alert !
     // NOTE:*****
     - test 및 분석 필요

### 2022-02-17

     - Board API 비즈니스 마무리
          - DeleteReply API 비즈니스 로직 분리
     - dms API 비즈니스 로직 분리 시작
          - createChatRoom API 끝

### 2022-02-18

     - leaveChatRoom API 분석 및 로직 수정
          - 비즈니스 로직 분리 할 예정

### 2022-02-19

     - leaveChatRoom API 비즈니스 로직 분리
     - createChatRoom API 로직 수정
          - deleteAt 값이 있으면 새로 방만들기
     - deleteDMS API 비즈니스 로직 분리
     - createDMS API 비즈니스 로직 분리

### 2022-02-20

     - DMS API 비즈니스 로직분리 완료
          - getChatRoomDMs API 작업
     - dotenv 제거 => @nestjs/config 로 마이그레이션

### 2022-02-21

     - dotenv 제거 => @nestjs/config 로 마이그레이션
          - process.env => configService.get()

### 2022-02-22

     - 이메일 인증하기 API 수정
          - 이메일 인증시 랜덤 비밀번호값 추출하는 로직 수정

### 2022-02-23

     - 도커파일 용량 최적화 
          - pkg 모듈 기술 검토

### 2022-02-24

     - 도커파일 용량 최적화 
          - docker build 이후 이미지 체크 해서 실서버에 배포

### 2022-02-25

     - dockerfile 환경을 리눅스 기반으로 node14-linux-x64 바이너리 파일 생성
     - env 파일내에 있는 키들이 인식이 안되는 이슈 발견
          - 도커 파일내에 env 파일이 없어서 생긴 이슈 env 파일을 넣어주니깐 서버가 잘돌아간다.
<!-- 실서버에 적용 시키기 -->

### 2022-02-26

     - pkg 바이너리 파일을 이용한 dockerfile 실서버 적용 test 
     
### 2022-02-27

     - ci 빌드 상 도커 빌드 이슈 
          - test 1
          - test 2
          - test 3
     - ci 빌드 내에 도커 이슈해결
          - docker 멀티스테이징 설계 수정
     - auth 미들웨어 로직수정
          - 미들웨어에 try catch 문을 잘못지워서 인증이 필요없는 api 호출시 서버 err 가 
          나서 다시 try catch 문을 넣어줬다.

### 2022-03-07

     - 도메인별 test code 구현 하기
          - 다른 github repo 탐색하면서 폴더구조 설계 탐색

### 2022-03-08

     - TDD 에 대해서 다른 github repo 탐색하면서 폴더구조 설계 탐색
          - 기초 셋팅!

### 2022-03-09

     - TDD
          - 상태 기반의 테스트 stb
          - 행위 기반의 테스트 mock
          - 위 두 종류에 대해서 탐색
          - 테스트 방식이 git repo 마다 너무 달라서 방향잡기가 쉽지가 않다.

### 2022-03-10

     - TDD
          - 살짝 감이 잘힐것같으나 잘 잡히질않는다.
          - 내부구현은 최대한 자제해야된다고 보았는데 아직 나에겐 추상적인 개념이다.
          - 상태 기반의 테스트를할것이냐 행위기반의 테스트를 할것인가를 구분하는 부분이 먼지 탐색필요

### 2022-03-13

     - TDD 셋팅 nest 에서 기본제공해주는 셋팅에서 추가 작업후 반영


### 2022-03-16

     - TDD register 코드 setup 중 이슈
          - user.findOne 이 없는 function 이라는 err 가뜬다. 해결해야된다.
               - 03-26
                    - mockUserRepoistory 에 findOne 메서드를 안만들어줘서 err가 난상태였다.

### 2022-03-17

     - test

### 2022-03-18

     - tdd class 듣기    
          - https://www.youtube.com/watch?v=dXOfOgFFKuY

### 2022-03-20

     - tdd class 듣기    
          - https://www.youtube.com/watch?v=XbSZnGCJB2I

### 2022-03-23

     - tdd
          - mongoose 가 아니라 typeOrm 이라면 testcode 짜는데 훨신 수월 했을거같은데 예제가 많이 없어 답답하다..ㅜㅜ

### 2022-03-27

     - tdd
          - 진짜 얼추 감을 잡은거같다. 하지만 아직도 명확하게 이거 맞는진 모르겠따.
          - err 처리하는 test code 짤 때 epect 에 함수를 집어넣어주고 toThorw를 쓰면 되는데 자꾸 catch 블록으로 잡으라는 err 가 떠서 일단 결국은 catch 로 잡아서 string 으로 받아 테스트 코드를 짜놨다. 머가 문제인지 알아볼 필요가 있을것 같다.

### 2022-03-31

     - tdd
          - jest.mock 보다는 ts-mockito
               - https://jojoldu.tistory.com/638?category=1036934
          - ts-mockito
               - https://npm.io/package/ts-mockito
          
### 2022-04-01

     - tdd
          - 로그인 성공 testcode 작성
               - findByEmailUser 메서드에서 mock 값이 null 나오는 err 발생
                    - 인자 값에 이메일이랑 리턴값에 이메일이 달라서 null 발생
               - 원본 pwd 와 해쉬된 pwd 값이 일치하지않아 err 발생
                    - 두개의 값을 위치를 다르게해서 발생
               - token 생성 함수 sgin 에서 secretkey 없다는 err 발생
                    - env 파일에서 바로 못가져오는것같아 일단 || 연산자로 err 처리

### 2022-04-02

     - tdd
          - login testCode 작성

### 2022-04-04

     - tdd 
          - userAuth TestCode 작성 

### 2022-04-06

     - tdd
          - userAuth 인증이 안된 경우 
          - password update 작성 예정

### 2022-04-11

     - tdd
          - password Update 작성 중 err 발생
               - mongoose 함수 document.save()가 jest TypeErr 가 떴다. save is not a function ..

### 2022-04-13

     - tdd
          - Jest TypeError: user_data.save is not a function
               - 해당 이슈에 대해 검토해보고 해결할려고 했지만 고질적인 문제같다..
               - 피해갈려면 update를 쳐야 될거같다.

### 2022-05-26

     - Reading Code
          - code reading 하면서 refactorinng 할 요소들 한번 훑어보아야겠다...

### 2022-05-29

     - nestjs 의 intersepto 는 AOP 패턴에서 영감을 얻은것
     - morgan 대체로 nestjs 자체 모듈의 loggerMiddleware 사용 가능

### to do


