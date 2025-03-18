var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var newsContainer = document.getElementById('news-container');
var languageSelect = document.getElementById('language');
var sortSelect = document.getElementById('sort');
var searchInput = document.getElementById('search');
var searchBtn = document.getElementById('search-btn');
var infoBar = document.getElementById('info-bar');
var resultCount = document.getElementById('result-count');
var loadTime = document.getElementById('load-time');
var modal = document.getElementById('news-modal');
var modalTitle = document.getElementById('modal-title');
var modalImage = document.getElementById('modal-image');
var modalDescription = document.getElementById('modal-description');
var modalContent = document.getElementById('modal-content');
var modalSource = document.getElementById('modal-source');
var modalDate = document.getElementById('modal-date');
var modalLink = document.getElementById('modal-link');
var closeModal = document.getElementById('close-modal');
var fontSmaller = document.getElementById('font-smaller');
var fontLarger = document.getElementById('font-larger');
var lightMode = document.getElementById('light-mode');
var darkMode = document.getElementById('dark-mode');
if (!newsContainer || !languageSelect || !sortSelect || !searchInput || !searchBtn || !infoBar || !resultCount || !loadTime || !modal || !modalTitle || !modalImage || !modalDescription || !modalContent || !modalSource || !modalDate || !modalLink || !closeModal || !fontSmaller || !fontLarger || !lightMode || !darkMode) {
    console.error('DOM nicht gefunden');
    document.body.innerHTML = '<p>Loading, prüfen DOM ID</p>';
    throw new Error('DOM nicht gefunden');
}
function fetchNews(language, sort, query) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, response, newsData, endTime, timeTaken, data_1, newsCards, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newsContainer.innerHTML = '<div class="loading">Loading...</div>';
                    startTime = performance.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    console.log('Fetching news for language:', language, 'sort:', sort, 'query:', query);
                    return [4 /*yield*/, fetch('/Daily_News/news-data.json')];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! Status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    newsData = _a.sent();
                    endTime = performance.now();
                    timeTaken = Math.round(endTime - startTime);
                    if (language === 'en') {
                        data_1 = newsData["".concat(language, "-").concat(sort)] || { status: "ok", totalResults: 0, articles: [] };
                    }
                    else {
                        data_1 = { status: "ok", totalResults: 0, articles: [] }; // 非 en 显示无
                    }
                    if (query) {
                        data_1.articles = data_1.articles.filter(function (article) {
                            return article.title.toLowerCase().includes(query.toLowerCase()) ||
                                (article.description && article.description.toLowerCase().includes(query.toLowerCase()));
                        });
                        data_1.totalResults = data_1.articles.length;
                    }
                    console.log('API 响应:', data_1);
                    newsContainer.innerHTML = '';
                    resultCount.textContent = data_1.totalResults.toString();
                    loadTime.textContent = timeTaken.toString();
                    if (data_1.totalResults === 0) {
                        newsContainer.innerHTML = "<div class=\"loading\">No news available for ".concat(language, "</div>");
                        return [2 /*return*/];
                    }
                    data_1.articles.forEach(function (article, index) {
                        var newsCard = "\n              <div class=\"news-card\" data-index=\"".concat(index, "\">\n                  <img src=\"").concat(article.urlToImage || 'https://picsum.photos/300/150', "\" alt=\"News Picture\">\n                  <div class=\"news-content\">\n                      <h2>").concat(article.title, "</h2>\n                      <p>").concat(article.description || 'No description yet', "</p>\n                      <div class=\"source\">Source: ").concat(article.source.name, "</div>\n                      <div class=\"date\">Date: ").concat(new Date(article.publishedAt).toLocaleDateString(), "</div>\n                  </div>\n              </div>\n          ");
                        newsContainer.insertAdjacentHTML('beforeend', newsCard);
                    });
                    updateFontSize();
                    newsCards = document.querySelectorAll('.news-card');
                    newsCards.forEach(function (card, index) {
                        card.addEventListener('click', function () {
                            var article = data_1.articles[index];
                            modalTitle.textContent = article.title;
                            modalImage.src = article.urlToImage || 'https://picsum.photos/300/150';
                            modalDescription.textContent = article.description || 'No description yet';
                            modalContent.textContent = article.content || 'No complete content (from API)';
                            modalSource.textContent = "Source: ".concat(article.source.name);
                            modalDate.textContent = "Date: ".concat(new Date(article.publishedAt).toLocaleDateString());
                            modalLink.href = article.url;
                            modal.style.display = 'flex';
                        });
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    newsContainer.innerHTML = "<div class=\"loading\">Loading error: ".concat(error_1.message || 'unknown error', "</div>");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
});
modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
var fontSize = 16;
fontSmaller.addEventListener('click', function () {
    if (fontSize > 12) {
        fontSize -= 2;
        updateFontSize();
        console.log('Reduce font size to:', fontSize);
    }
});
fontLarger.addEventListener('click', function () {
    if (fontSize < 24) {
        fontSize += 2;
        updateFontSize();
        console.log('Increase the font to:', fontSize);
    }
});
function updateFontSize() {
    var newsContents = document.querySelectorAll('.news-content');
    console.log('The number of news-contents found:', newsContents.length);
    newsContents.forEach(function (content) {
        content.style.fontSize = "".concat(fontSize, "px");
        var h2 = content.querySelector('h2');
        var p = content.querySelector('p');
        var source = content.querySelector('.source');
        var date = content.querySelector('.date');
        if (h2)
            h2.style.fontSize = "".concat(fontSize + 2, "px");
        if (p)
            p.style.fontSize = "".concat(fontSize, "px");
        if (source)
            source.style.fontSize = "".concat(fontSize - 2, "px");
        if (date)
            date.style.fontSize = "".concat(fontSize - 2, "px");
    });
    var modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.fontSize = "".concat(fontSize, "px");
        var modalH2 = modalContent.querySelector('#modal-title');
        var modalP = modalContent.querySelector('#modal-description');
        var modalC = modalContent.querySelector('#modal-content');
        var modalS = modalContent.querySelector('#modal-source');
        var modalD = modalContent.querySelector('#modal-date');
        if (modalH2)
            modalH2.style.fontSize = "".concat(fontSize + 2, "px");
        if (modalP)
            modalP.style.fontSize = "".concat(fontSize, "px");
        if (modalC)
            modalC.style.fontSize = "".concat(fontSize, "px");
        if (modalS)
            modalS.style.fontSize = "".concat(fontSize - 2, "px");
        if (modalD)
            modalD.style.fontSize = "".concat(fontSize - 2, "px");
    }
}
lightMode.addEventListener('click', function () {
    document.body.classList.remove('night-mode');
});
darkMode.addEventListener('click', function () {
    document.body.classList.add('night-mode');
});
function init() {
    fetchNews(languageSelect.value, sortSelect.value);
    languageSelect.addEventListener('change', function () {
        fetchNews(languageSelect.value, sortSelect.value, searchInput.value.trim() || undefined);
    });
    sortSelect.addEventListener('change', function () {
        fetchNews(languageSelect.value, sortSelect.value, searchInput.value.trim() || undefined);
    });
    searchBtn.addEventListener('click', function () {
        var query = searchInput.value.trim();
        fetchNews(languageSelect.value, sortSelect.value, query || undefined);
    });
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            var query = searchInput.value.trim();
            fetchNews(languageSelect.value, sortSelect.value, query || undefined);
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    init();
});
