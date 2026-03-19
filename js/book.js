async function bookData() {
    const params = new URLSearchParams({
        target: "title",
        query: "미움받을 용기",
        size: 10
    });

    const url = `https://dapi.kakao.com/v3/search/book?${params}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: "KakaoAK ec7ef5dd2c873669cff94595bdf52bf5"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        const boxElements = document.querySelectorAll(".box");

        boxElements.forEach((box, i) => {
            const doc = data.documents[i];
            if (!doc) return;

            box.innerHTML = `
                <img src="${doc.thumbnail || 'https://via.placeholder.com/120x174?text=No+Image'}" alt="${doc.title}">
                <h3>${doc.title}</h3>
                <h6>${doc.authors.join(", ")}</h6>
                <p>${doc.contents ? doc.contents.substring(0, 60) + "..." : "내용 없음"}</p>
                <button type="button">click</button>
            `;
        });

    } catch (error) {
        console.log("에러 발생:", error);
    }
}

bookData();