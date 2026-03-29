const topBooks = [
  "2026 심우철 실전 동형 모의고사 Season 1",
  "2026 심우철 실전 동형 모의고사 Season 2",
  "2026 선재국어 결승선 봉투 모의고사",
  "2026 문동균 한국사 실전 봉투 모의고사",
  "2026 선재국어 출발선 봉투 모의고사",
  "2026 문동균 한국사 한 권으로 모든 것을",
  "2026 심슨 보카",
  "2026 문동균 한국사 기출은 문동균",
  "2026 문동균 한국사 D-30 문단속 모의고사",
  "2027 안단테 공직 선거법 기본서"
];

const bottomBooks = [
  "2026 이유진 국어 백일기도 모의고사",
  "2026 이동기 영어 동형 모의고사",
  "2026 써니 행정법총론 기출문제집",
  "2027 NFT정주형 형법 총론",
  "2026 이유진 국어 독해 알고리즘"
];

const sliderBooks = [
  {
    title: "[지방자치론] 2026 황철곤 지방자치론 - 이론+기출 ALL IN ONE",
    author: "황철곤 · 시스퍼블",
    price: "27,000원",
    discount: "10%",
    rank: "추천 교재",
    desc: "지방자치론 핵심 이론과 기출을 한 권으로 정리한 교재입니다.",
    mainImg: "./img/book1.jpg",
    thumbImg: "./img/book1.jpg"
  },
  {
    title: "[영어] 2026 심우철 실전 동형 모의고사 Season 2",
    author: "심우철 · 에스티유니타스",
    price: "13,500원",
    discount: "10%",
    rank: "베스트셀러 2위",
    desc: "실전 감각을 끌어올리는 동형 모의고사 교재입니다.",
    mainImg: "./img/book2.jpg",
    thumbImg: "./img/book2.jpg"
  },
  {
    title: "[국어] 2026 이유진 국어 백일기도 모의고사",
    author: "이유진 · 고시동네",
    price: "25,200원",
    discount: "10%",
    rank: "인기 교재",
    desc: "국어 실전 대비용 모의고사 교재입니다.",
    mainImg: "./img/book3.jpg",
    thumbImg: "./img/book3.jpg"
  },
  {
    title: "[한국사] 2026 문동균 한국사 기출은 문동균",
    author: "문동균",
    price: "22,000원",
    discount: "5%",
    rank: "베스트셀러",
    desc: "기출 중심으로 한국사를 정리한 핵심 교재입니다.",
    mainImg: "./img/book4.jpg",
    thumbImg: "./img/book4.jpg"
  },
  {
    title: "[행정법] 2026 써니 행정법총론 기출문제집",
    author: "써니",
    price: "28,000원",
    discount: "10%",
    rank: "추천 교재",
    desc: "행정법 기출문제를 체계적으로 정리한 교재입니다.",
    mainImg: "./img/book5.jpg",
    thumbImg: "./img/book5.jpg"
  }
];

function getAuthHeader() {
  return {
    Authorization: "KakaoAK ec7ef5dd2c873669cff94595bdf52bf5"
  };
}

async function fetchBook(keyword) {
  const params = new URLSearchParams({
    target: "title",
    query: keyword,
    size: 10
  });

  const url = `https://dapi.kakao.com/v3/search/book?${params}`;

  const response = await fetch(url, {
    headers: getAuthHeader()
  });

  if (!response.ok) {
    throw new Error(`HTTP 오류: ${response.status}`);
  }

  const data = await response.json();

  if (!data.documents || data.documents.length === 0) {
    return null;
  }

  const bookWithImage = data.documents.find(
    (book) => book.thumbnail && book.thumbnail.trim() !== ""
  );

  return bookWithImage || null;
}

function createBookCard(book, index = null) {
  const img = book.thumbnail || "https://via.placeholder.com/180x240?text=No+Image";
  const authors = book.authors?.join(", ") || "저자 정보 없음";
  const salePrice = book.sale_price || book.price || 0;
  const originalPrice = book.price || 0;

  let discountText = "";
  if (originalPrice > salePrice && originalPrice > 0) {
    const discountRate = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    discountText = `${discountRate}%`;
  }

  const numberBadge =
    index !== null ? `<span class="book-rank">${index + 1}</span>` : "";

return `
  <a href="./sub.html" class="book-link">
    <div class="book-item">
      <div class="book-thumb">
        <img src="${img}" alt="${book.title}">
      </div>
      <div class="book-info">
        ${numberBadge}
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${authors}</p>
        <p class="book-price">
          <span class="discount">${discountText}</span>
          <span class="price">${salePrice ? salePrice.toLocaleString() + "원" : "가격 정보 없음"}</span>
        </p>
      </div>
    </div>
  </a>
`;
}

async function loadBooks(bookList, containerId, showRank = false) {
  const container = document.getElementById(containerId);

  console.log("컨테이너 확인:", containerId, container);

  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < bookList.length; i++) {
    const keyword = bookList[i];

    try {
      const book = await fetchBook(keyword);

      if (!book) {
        console.log("안 뜨는 책:", keyword);
        continue;
      }

      container.innerHTML += createBookCard(book, showRank ? i : null);
    } catch (error) {
      console.log(`${keyword} 불러오기 실패:`, error);
      container.innerHTML += `
        <div class="book-item empty">
          <p>불러오기 실패</p>
        </div>
      `;
    }
  }
}

async function searchBook() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  let keyword = searchInput.value.trim();

  if (!keyword) {
    keyword = "베스트셀러";
  }

  const searchResult = document.getElementById("search-result");
  if (!searchResult) return;

  searchResult.innerHTML = "<p>검색 중...</p>";

  try {
    const params = new URLSearchParams({
      target: "title",
      query: keyword,
      size: 10
    });

    const url = `https://dapi.kakao.com/v3/search/book?${params}`;

    const response = await fetch(url, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const data = await response.json();

    if (!data.documents.length) {
      searchResult.innerHTML = "<p>검색 결과 없음</p>";
      return;
    }

    searchResult.innerHTML = "";
    data.documents.forEach((book) => {
      searchResult.innerHTML += createBookCard(book);
    });
  } catch (error) {
    console.log("검색 에러:", error);
    searchResult.innerHTML = "<p>검색 중 오류 발생</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("book.js 실행됨");

  const searchInput = document.getElementById("search");

  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchBook();
      }
    });
  }

  loadBooks(topBooks, "top-book-grid", true);
  loadBooks(bottomBooks, "bottom-book-grid", false);

 
  renderSlider(currentSlide);

  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }
});
let currentSlide = 0;

function renderSlider(index) {
  const book = sliderBooks[index];
  if (!book) return;

  const mainImg = document.getElementById("slider-main-img");
  const title = document.getElementById("slider-title");
  const author = document.getElementById("slider-author");
  const discount = document.getElementById("slider-discount");
  const price = document.getElementById("slider-price");
  const rank = document.getElementById("slider-rank");
  const desc = document.getElementById("slider-desc");
  const thumbs = document.getElementById("slider-thumbs");

  if (!mainImg || !title || !author || !discount || !price || !rank || !thumbs) return;

  mainImg.src = book.mainImg;
  mainImg.alt = book.title;
  title.textContent = book.title;
  author.textContent = book.author;
  discount.textContent = book.discount;
  price.textContent = book.price;
  rank.textContent = book.rank;

  if (desc) {
    desc.textContent = book.desc || "";
  }

  thumbs.innerHTML = "";

  sliderBooks.forEach((item, i) => {
    const thumb = document.createElement("img");
    thumb.src = item.thumbImg || item.mainImg;
    thumb.alt = item.title;
    thumb.className = `thumb ${i === index ? "active" : ""}`;

    thumb.addEventListener("click", () => {
      currentSlide = i;
      renderSlider(currentSlide);
    });

    thumbs.appendChild(thumb);
  });
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % sliderBooks.length;
  renderSlider(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + sliderBooks.length) % sliderBooks.length;
  renderSlider(currentSlide);
}

setInterval(() => {
  nextSlide();
}, 3000); // 3초마다 자동 슬라이드