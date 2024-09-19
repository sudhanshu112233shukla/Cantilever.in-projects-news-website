// API configuration
const API_KEY = "pub_535257d598641dfa62023c12a1c8bc037763b";
const baseURL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=everything`;

// Function to fetch data from the API
async function fetchData(query) {
    try {
        const res = await fetch(`${baseURL}&q=${query}`);  // Corrected fetch call
        
        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        
        const data = await res.json();

        // Log the full data to the console
        console.log('API Data:', data);

        // Ensure that data is returned as expected
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
function renderMain(arr) {
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

    document.querySelector("main").innerHTML = mainHTML;
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
        if (query) {
            const data = await fetchData(query);
            if (data && data.results) {
                renderMain(data.results);
            } else {
                console.error("No results found");
            }
        }
    });
}

if (searchBtnMobile) {
    searchBtnMobile.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInputMobile.value;
        if (query) {
            const data = await fetchData(query);
            if (data && data.results) {
                renderMain(data.results);
            } else {
                console.error("No results found");
            }
        }
    });
}

// Initial fetch to load default news
async function Search(query) {
    const data = await fetchData(query);
    if (data && data.results) {
        renderMain(data.results);
    } else {
        console.error("No results found");
    }
}

// Call Search to fetch and log all data on page load
Search('everything');
