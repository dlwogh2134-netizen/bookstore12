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
});