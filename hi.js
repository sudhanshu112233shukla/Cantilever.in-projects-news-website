// API configuration
const API_KEY = "pub_535257d598641dfa62023c12a1c8bc037763b";
const baseURL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}`;

// Function to fetch data from the API (with pagination support)
async function fetchData(query = '', page = '') {
    try {
        let url = `${baseURL}`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (page) url += `&page=${encodeURIComponent(page)}`;
        url += `&language=en&size=10`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        // Log the full data to the console
        console.log('API Data:', data);
        if (data.results) {
            return data;
        } else {
            throw new Error("No results found");
        }
    } catch (error) {
        console.error("Error fetching the news data:", error);
    }
}

// Function to render fetched news articles
function renderMain(arr, append = false) {
    let mainHTML = '';
    arr.forEach(article => {
        if (article.title && article.link) {
            mainHTML += `
                <div class="card">
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                        <h4>${article.title}</h4>
                        ${article.image_url ? `<img src="${article.image_url}" alt="News Image" loading="lazy" />` : ''}
                        <div class="publishbyDate">
                            ${article.source_name ? `<p>Source: ${article.source_name}</p>` : ''}
                            <span>•</span>
                            ${article.pubDate ? `<p>${new Date(article.pubDate).toLocaleDateString()}</p>` : ''}
                        </div>
                        <div class="desc">
                            ${article.description || "Description not available"}
                        </div>
                    </a>
                </div>
            `;
        }
    });
    const main = document.querySelector("main");
    if (append) {
        main.insertAdjacentHTML('beforeend', mainHTML);
    } else {
        main.innerHTML = mainHTML;
    }
}

// Mobile menu toggle
let mobilemenu = document.querySelector(".mobile");
let menuBtn = document.querySelector(".menuBtn");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        mobilemenu.classList.toggle("hidden");
    });
}

// Handle search functionality for both desktop and mobile
const searchBtn = document.getElementById("searchForm");
const searchBtnMobile = document.getElementById("searchFormMobile");
const searchInput = document.getElementById("searchInput");
const searchInputMobile = document.getElementById("searchInputMobile");

if (searchBtn) {
    searchBtn.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInput.value;
        lastQuery = query;
        currentPage = '';
        // Always fetch, even if query is empty
        const data = await fetchData(query);
        if (data && data.results) {
            renderMain(data.results);
            renderPagination(data.nextPage);
            currentPage = data.nextPage || '';
        } else {
            console.error("No results found");
        }
    });
}

if (searchBtnMobile) {
    searchBtnMobile.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInputMobile.value;
        lastQuery = query;
        currentPage = '';
        // Always fetch, even if query is empty
        const data = await fetchData(query);
        if (data && data.results) {
            renderMain(data.results);
            renderPagination(data.nextPage);
            currentPage = data.nextPage || '';
        } else {
            console.error("No results found");
        }
    });
}

// Pagination controls
let currentPage = '';
let lastQuery = '';

function renderPagination(nextPage) {
    const main = document.querySelector('main');
    let paginationHTML = '';
    if (nextPage) {
        paginationHTML += `<button id="loadMoreBtn">Load More</button>`;
    }
    main.insertAdjacentHTML('beforeend', paginationHTML);
    if (nextPage) {
        document.getElementById('loadMoreBtn').onclick = async () => {
            const data = await fetchData(lastQuery, nextPage);
            if (data && data.results) {
                renderMain(data.results, true); // append
                renderPagination(data.nextPage);
                currentPage = data.nextPage || '';
            }
        };
    }
}

// Initial fetch to load latest news
async function Search(query = '') {
    lastQuery = query;
    currentPage = '';
    const data = await fetchData(query);
    if (data && data.results) {
        renderMain(data.results);
        renderPagination(data.nextPage);
        currentPage = data.nextPage || '';
    } else {
        console.error("No results found");
    }
}

// Call Search to fetch and log all data on page load
Search();
