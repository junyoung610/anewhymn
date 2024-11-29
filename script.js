document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    const listH1 = document.getElementById("list-h1");
    const listView = document.getElementById("list-view");
    const contentView = document.getElementById("content-view");
    const bookList = document.getElementById("book-list");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const backToListButton = document.getElementById("back-to-list");
    const sectionTitle = document.getElementById("section-title");
    const sectionContent = document.getElementById("section-content");
    const sectionImage = document.getElementById("section-image");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");

    let data = [];
    let currentIndex = -1;

    // JSON 데이터를 로드하여 목록 표시
    async function loadData() {
        try {
            const response = await fetch("data.json");
            data = await response.json();
            renderList(data);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    }

    // 목록 렌더링
    function renderList(items) {
        bookList.innerHTML = ""; // 기존 목록 초기화
        items.forEach((item) => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = item.title;
            link.dataset.id = item.id;
            li.appendChild(link);
            bookList.appendChild(li);

            // 항목 클릭 시 섹션 보기
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const id = link.dataset.id;
                showSection(id);
            });
        });
    }

    // 검색 기능
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase().trim();
        const filteredData = data.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query)
        );
        renderList(filteredData);
    });

    // 검색 실행 함수
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const filteredData = data.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query)
        );
        renderList(filteredData);
    }

    // 검색 버튼 클릭 시 검색 실행
    searchButton.addEventListener("click", () => {
        performSearch();
    });

    // Enter 키를 눌렀을 때 검색 실행
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            performSearch();
        }
    });

    // 섹션 보기
    function showSection(id) {
        const index = data.findIndex((item) => item.id === id);
        if (index === -1) return;

        currentIndex = index;
        const item = data[index];
        sectionTitle.textContent = item.title;
        sectionContent.textContent = item.content;
        sectionImage.src = item.image;

        listH1.style.display = "none";
        listView.style.display = "none";
        bookList.style.display = "none";
        contentView.style.display = "block";
        backToListButton.style.display = "inline-block";
        header.style.display = "none"; // 콘텐츠 보기 시 헤더 숨김

        // 이전/다음 버튼 상태 업데이트
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === data.length - 1;
    }

    // 목록으로 돌아가기
    backToListButton.addEventListener("click", () => {
        listH1.style.display = "block";
        listView.style.display = "block";
        bookList.style.display = "flex";
        contentView.style.display = "none";
        backToListButton.style.display = "none";
        header.style.display = "block"; // 목록으로 돌아가면 헤더 보이기
    });

    // 이전/다음 버튼 동작
    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            showSection(data[currentIndex - 1].id);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentIndex < data.length - 1) {
            showSection(data[currentIndex + 1].id);
        }
    });

    // 초기화
    loadData();
});
// 모달 열기
function openModal(imgSrc) {
    const modal = document.getElementById("imageModal");
    const expandedImage = document.getElementById("expandedImage");

    // 클릭한 이미지의 src를 모달 이미지에 설정
    expandedImage.src = imgSrc;

    // 모달 표시
    modal.style.display = "flex";
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

// 이미지에 이벤트 리스너 추가
document.getElementById("section-image").addEventListener("click", function () {
    openModal(this.src);
});

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// 로컬 스토리지에서 모드 상태를 가져오기
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.classList.replace("ri-sun-line", "ri-moon-line");
}

// 모드 전환
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeIcon.classList.replace("ri-sun-line", "ri-moon-line");
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
        localStorage.setItem("theme", "light");
    }
});
