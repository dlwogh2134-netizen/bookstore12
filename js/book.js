
const dangiBooks = [
  "2026 심우철 실전 동형 모의고사 Season 2",
  "2026 선재국어 결승선 봉투 모의고사",
  "2026 문동균 한국사 지방직 대비 실전 봉투 모의고사",
  "2026 김유경 고백천제 사회복지학개론 전 범위 동형모의고사 50회",
  "2026 이유진 국어 백일기도 모의고사",
  "2026 이동기 영어 동형 모의고사",
  "2026 써니 행정법 총정리",
  "2026 신용한 행정학 실전 모의고사"
];


function searchBook() {
  let keyword = document.getElementById("search").value.trim();

  if (!keyword) {
    keyword = "베스트셀러";
  }

  bookData(keyword);
}


async function bookData(keyword) {
  try {
    const params = new URLSearchParams({
      target: "title",
      query: keyword,
      size: 8
    });

    const url = `https://dapi.kakao.com/v3/search/book?${params}`;

    const response = await fetch(url, {
      headers: {
        Authorization: "KakaoAK ec7ef5dd2c873669cff94595bdf52bf5"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const data = await response.json();
    const slides = document.querySelectorAll("#new .swiper-slide");

    slides.forEach((slide, i) => {
      const book = data.documents[i];

      if (!book) {
        slide.innerHTML = "";
        return;
      }

      const img = book.thumbnail || "https://via.placeholder.com/150x200?text=No+Image";
      const authors = book.authors?.join(", ") || "저자 정보 없음";
      const price = book.price ? `${book.price.toLocaleString()}원` : "가격 정보 없음";

      slide.innerHTML = `
        <div class="book-card">
          <img src="${img}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>${authors}</p>
          <strong>${price}</strong>
        </div>
      `;
    });
  } catch (error) {
    console.log("검색 에러:", error);
  }
}


async function loadDangiBooks() {
  const slides = document.querySelectorAll("#new .swiper-slide");

  for (let i = 0; i < slides.length; i++) {
    const keyword = dangiBooks[i];

    if (!keyword) {
      slides[i].innerHTML = "";
      continue;
    }

    try {
      const params = new URLSearchParams({
        target: "title",
        query: keyword,
        size: 1
      });

      const url = `https://dapi.kakao.com/v3/search/book?${params}`;

      const response = await fetch(url, {
        headers: {
          Authorization: "KakaoAK ec7ef5dd2c873669cff94595bdf52bf5"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const data = await response.json();
      const book = data.documents[0];

      if (!book) {
        slides[i].innerHTML = `<p>검색 결과 없음</p>`;
        continue;
      }

      const img = book.thumbnail || "https://via.placeholder.com/150x200?text=No+Image";
      const authors = book.authors?.join(", ") || "저자 정보 없음";
      const price = book.price ? `${book.price.toLocaleString()}원` : "가격 정보 없음";

      slides[i].innerHTML = `
        <div class="book-card">
          <img src="${img}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>${authors}</p>
          <strong>${price}</strong>
        </div>
      `;
    } catch (error) {
      console.log(`${keyword} 불러오기 실패:`, error);
      slides[i].innerHTML = `<p>불러오기 실패</p>`;
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");

  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchBook();
      }
    });
  }

  loadDangiBooks();
  loadMoreBooks();
});
async function loadMoreBooks() {
  const grid = document.getElementById("book-grid");

  
  for (let i = 0; i < dangiBooks.length; i++) {
    const keyword = dangiBooks[i];

    try {
      const params = new URLSearchParams({
        target: "title",
        query: keyword,
        size: 1
      });

      const url = `https://dapi.kakao.com/v3/search/book?${params}`;

      const response = await fetch(url, {
        headers: {
          Authorization: "KakaoAK ec7ef5dd2c873669cff94595bdf52bf5"
        }
      });

      const data = await response.json();
      const book = data.documents[0];

      if (!book) continue;

      const img = book.thumbnail || "https://via.placeholder.com/150x200?text=No+Image";

      
      grid.innerHTML += `
        <div class="book-item">
          <img src="${img}">
          <h4>${book.title}</h4>
        </div>
      `;
    } catch (error) {
      console.log("에러:", error);
    }
  }
}