# AWS CodeCommit 동기화 설정 가이드

이 가이드는 GitHub 저장소를 AWS CodeCommit으로 자동 동기화하는 방법을 설명합니다.

## 1. AWS CodeCommit HTTPS Git Credentials 생성

1. **AWS IAM Console**에 로그인합니다
2. **Users** → 본인의 IAM 사용자 선택
3. **Security credentials** 탭 클릭
4. **HTTPS Git credentials for AWS CodeCommit** 섹션으로 스크롤
5. **Generate credentials** 버튼 클릭
6. 생성된 **Username**과 **Password**를 안전한 곳에 복사해둡니다
   - ⚠️ **중요**: 이 비밀번호는 생성 시 한 번만 표시됩니다!

## 2. GitHub Environment Secrets 설정

1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 사이드바에서 **Environments** 클릭
4. **Prod** environment 클릭 (이미 생성하셨다면)
5. **Add secret** 버튼 클릭
6. 다음 두 개의 secret을 생성합니다:

### Secret 1: CODECOMMIT_USERNAME
- **Name**: `CODECOMMIT_USERNAME`
- **Value**: AWS에서 생성한 Git credentials의 Username (예: `user-at-123456789012`)

### Secret 2: CODECOMMIT_PASSWORD
- **Name**: `CODECOMMIT_PASSWORD`
- **Value**: AWS에서 생성한 Git credentials의 Password

## 3. 워크플로우 동작 확인

설정이 완료되면:
- `main` 브랜치에 push할 때마다 자동으로 CodeCommit에 동기화됩니다
- **Actions** 탭에서 워크플로우 실행 상태를 확인할 수 있습니다

## 4. 트러블슈팅

### 인증 실패 시
- IAM 사용자에게 CodeCommit 권한이 있는지 확인
  - 필요한 정책: `AWSCodeCommitPowerUser` 또는 `AWSCodeCommitFullAccess`
- GitHub Secrets의 Username과 Password가 정확한지 확인

### 동기화가 안 될 때
- Actions 탭에서 에러 로그 확인
- CodeCommit 저장소 이름이 정확한지 확인: `gachiroun-web`
- Region이 올바른지 확인: `ap-northeast-2`

## 참고사항

- 이 워크플로우는 **mirror** 방식으로 동작하여 모든 브랜치와 태그를 동기화합니다
- Public 저장소이지만 Secrets는 암호화되어 안전하게 보관됩니다
- Secrets는 로그에 노출되지 않습니다 (GitHub가 자동으로 마스킹 처리)
