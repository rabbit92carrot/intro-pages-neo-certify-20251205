// 슬라이드 목록
const slides = [
  'slide-01-cover.html',
  'slide-02-contents.html',
  'slide-03-overview.html',
  'slide-04-roles.html',
  'slide-05-flow-normal.html',
  'slide-06-flow-exception.html',
  'slide-07-virtual-code.html',
  'slide-08-user-convenience.html',
  'slide-09-data-integrity.html',
  'slide-10-data-1.html',
  'slide-11-data-2.html',
  'slide-11-lifecycle.html',
  'slide-12-data-3.html',
  'slide-12-erd-v2.html',
  'slide-13-screens-1.html',
  'slide-14-screens-2.html',
  'slide-sitemap-option-c-overview.html',
  'slide-sitemap-option-c-detail.html',
  'slide-sitemap-c-distributor.html',
  'slide-sitemap-c-hospital.html',
  'slide-sitemap-c-admin.html',
  'slide-15-screens-3.html',
  'slide-16-wireframe-1.html',
  'slide-17-wireframe-2.html',
  'slide-18-architecture.html',
  'slide-19-qna.html'
];

// 슬라이드 제목 (썸네일용)
const slideTitles = [
  '표지',
  '목차',
  '서비스 개요',
  '사용자 역할',
  '정상 유통',
  '예외 처리',
  '가상 식별코드',
  '사용자 편의성',
  '데이터 무결성',
  '핵심 엔티티',
  '트랜잭션',
  '제품 생애',
  '이력 관리',
  'ERD',
  '페이지 관계도 1',
  '페이지 관계도 2',
  '전체 페이지 맵',
  '제조사 상세',
  '유통사 상세',
  '병원 상세',
  '관리자 상세',
  '대시보드',
  '핵심 기능',
  '재고 조회',
  '아키텍처',
  'Q&A'
];

let currentIndex = 0;

// DOM 요소
const iframe = document.getElementById('slide-frame');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentSlideEl = document.getElementById('current-slide');
const totalSlidesEl = document.getElementById('total-slides');
const progressFill = document.getElementById('progress-fill');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const slideIndicator = document.getElementById('slide-indicator');
const thumbnailPanel = document.getElementById('thumbnail-panel');
const preloadPrev = document.getElementById('preload-prev');
const preloadNext = document.getElementById('preload-next');
const container = document.querySelector('.presentation-container');

// 초기화
function init() {
  totalSlidesEl.textContent = slides.length;

  // 썸네일 패널 생성
  createThumbnails();

  // 초기 상태 업데이트
  updateNavigation();
  preloadAdjacent();

  // 이벤트 리스너 등록
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  slideIndicator.addEventListener('click', toggleThumbnails);
  document.addEventListener('keydown', handleKeydown);

  // 썸네일 패널 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!thumbnailPanel.contains(e.target) &&
        !slideIndicator.contains(e.target) &&
        thumbnailPanel.classList.contains('visible')) {
      thumbnailPanel.classList.remove('visible');
    }
  });

  // 전체화면 변경 감지
  document.addEventListener('fullscreenchange', updateFullscreenButton);
}

// 썸네일 패널 생성
function createThumbnails() {
  thumbnailPanel.innerHTML = '';

  slides.forEach((slide, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumbnail' + (index === currentIndex ? ' active' : '');
    thumb.innerHTML = `
      <span class="thumb-num">${index + 1}</span>
      <span class="thumb-title">${slideTitles[index]}</span>
    `;
    thumb.addEventListener('click', () => {
      goToSlide(index);
      thumbnailPanel.classList.remove('visible');
    });
    thumbnailPanel.appendChild(thumb);
  });
}

// 썸네일 활성 상태 업데이트
function updateThumbnails() {
  const thumbs = thumbnailPanel.querySelectorAll('.thumbnail');
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentIndex);
  });
}

// 썸네일 패널 토글
function toggleThumbnails(e) {
  e.stopPropagation();
  thumbnailPanel.classList.toggle('visible');
}

// 슬라이드 이동
function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;

  currentIndex = index;
  iframe.src = `neo-certify-ppt-source/${slides[currentIndex]}`;
  updateNavigation();
  updateThumbnails();
  preloadAdjacent();
}

function goPrev() {
  goToSlide(currentIndex - 1);
}

function goNext() {
  goToSlide(currentIndex + 1);
}

// 네비게이션 상태 업데이트
function updateNavigation() {
  currentSlideEl.textContent = currentIndex + 1;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === slides.length - 1;

  // 진행률 업데이트
  const progress = ((currentIndex + 1) / slides.length) * 100;
  progressFill.style.width = `${progress}%`;
}

// 인접 슬라이드 프리로드
function preloadAdjacent() {
  const prevIdx = currentIndex - 1;
  const nextIdx = currentIndex + 1;

  if (prevIdx >= 0) {
    preloadPrev.src = `neo-certify-ppt-source/${slides[prevIdx]}`;
  } else {
    preloadPrev.src = '';
  }

  if (nextIdx < slides.length) {
    preloadNext.src = `neo-certify-ppt-source/${slides[nextIdx]}`;
  } else {
    preloadNext.src = '';
  }
}

// 전체화면 토글
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.log('전체화면 전환 실패:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

// 전체화면 버튼 아이콘 업데이트
function updateFullscreenButton() {
  if (document.fullscreenElement) {
    fullscreenBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    fullscreenBtn.title = '전체화면 종료 (F)';
  } else {
    fullscreenBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    fullscreenBtn.title = '전체화면 (F)';
  }
}

// 키보드 네비게이션
function handleKeydown(e) {
  // 썸네일 패널이 열려있을 때 Escape로 닫기
  if (e.key === 'Escape' && thumbnailPanel.classList.contains('visible')) {
    e.preventDefault();
    thumbnailPanel.classList.remove('visible');
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      goPrev();
      break;
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
      e.preventDefault();
      goNext();
      break;
    case 'Home':
      e.preventDefault();
      goToSlide(0);
      break;
    case 'End':
      e.preventDefault();
      goToSlide(slides.length - 1);
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleFullscreen();
      break;
    case 't':
    case 'T':
      e.preventDefault();
      thumbnailPanel.classList.toggle('visible');
      break;
  }
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', init);
