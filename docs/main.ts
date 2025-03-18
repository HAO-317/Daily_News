interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
  content: string | null;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

interface NewsData {
  [key: string]: NewsResponse;
}

const newsContainer: HTMLElement | null = document.getElementById('news-container');
const languageSelect: HTMLSelectElement | null = document.getElementById('language') as HTMLSelectElement;
const sortSelect: HTMLSelectElement | null = document.getElementById('sort') as HTMLSelectElement;
const searchInput: HTMLInputElement | null = document.getElementById('search') as HTMLInputElement;
const searchBtn: HTMLButtonElement | null = document.getElementById('search-btn') as HTMLButtonElement;
const infoBar: HTMLElement | null = document.getElementById('info-bar');
const resultCount: HTMLElement | null = document.getElementById('result-count');
const loadTime: HTMLElement | null = document.getElementById('load-time');
const modal: HTMLElement | null = document.getElementById('news-modal');
const modalTitle: HTMLElement | null = document.getElementById('modal-title');
const modalImage: HTMLImageElement | null = document.getElementById('modal-image') as HTMLImageElement;
const modalDescription: HTMLElement | null = document.getElementById('modal-description');
const modalContent: HTMLElement | null = document.getElementById('modal-content');
const modalSource: HTMLElement | null = document.getElementById('modal-source');
const modalDate: HTMLElement | null = document.getElementById('modal-date');
const modalLink: HTMLAnchorElement | null = document.getElementById('modal-link') as HTMLAnchorElement;
const closeModal: HTMLElement | null = document.getElementById('close-modal');
const fontSmaller: HTMLButtonElement | null = document.getElementById('font-smaller') as HTMLButtonElement;
const fontLarger: HTMLButtonElement | null = document.getElementById('font-larger') as HTMLButtonElement;
const lightMode: HTMLButtonElement | null = document.getElementById('light-mode') as HTMLButtonElement;
const darkMode: HTMLButtonElement | null = document.getElementById('dark-mode') as HTMLButtonElement;

if (!newsContainer || !languageSelect || !sortSelect || !searchInput || !searchBtn || !infoBar || !resultCount || !loadTime || !modal || !modalTitle || !modalImage || !modalDescription || !modalContent || !modalSource || !modalDate || !modalLink || !closeModal || !fontSmaller || !fontLarger || !lightMode || !darkMode) {
  console.error('DOM nicht gefunden');
  document.body.innerHTML = '<p>Loading, prüfen DOM ID</p>';
  throw new Error('DOM nicht gefunden');
}

async function fetchNews(language: string, sort: string, query?: string): Promise<void> {
  newsContainer.innerHTML = '<div class="loading">Loading...</div>';
  const startTime: number = performance.now();

  try {
      const response: Response = await fetch('/docs/news-data.json'); // 假设部署在 docs 目录
      const newsData: NewsData = await response.json();
      const endTime: number = performance.now();
      const timeTaken: number = Math.round(endTime - startTime);

      let data: NewsResponse;
      if (query) {
        
          data = newsData[`${language}-${sort}`];
          data.articles = data.articles.filter(article =>
              article.title.toLowerCase().includes(query.toLowerCase()) ||
              (article.description && article.description.toLowerCase().includes(query.toLowerCase()))
          );
          data.totalResults = data.articles.length;
      } else {
          data = newsData[`${language}-${sort}`];
      }

      console.log('API 响应:', data);

      if (!data || data.status !== 'ok') {
          throw new Error('Data not available');
      }

      newsContainer.innerHTML = '';
      resultCount.textContent = data.totalResults.toString();
      loadTime.textContent = timeTaken.toString();

      if (data.articles.length === 0) {
          newsContainer.innerHTML = '<div class="loading">No related news</div>';
          return;
      }

      data.articles.forEach((article: Article, index: number) => {
          const newsCard: string = `
              <div class="news-card" data-index="${index}">
                  <img src="${article.urlToImage || 'https://picsum.photos/300/150'}" alt="News Picture">
                  <div class="news-content">
                      <h2>${article.title}</h2>
                      <p>${article.description || 'No description yet'}</p>
                      <div class="source">Source: ${article.source.name}</div>
                      <div class="date">Date: ${new Date(article.publishedAt).toLocaleDateString()}</div>
                  </div>
              </div>
          `;
          newsContainer.insertAdjacentHTML('beforeend', newsCard);
      });

      updateFontSize();

      const newsCards: NodeListOf<HTMLElement> = document.querySelectorAll('.news-card');
      newsCards.forEach((card, index) => {
          card.addEventListener('click', () => {
              const article: Article = data.articles[index];
              modalTitle.textContent = article.title;
              modalImage.src = article.urlToImage || 'https://picsum.photos/300/150';
              modalDescription.textContent = article.description || 'No description yet';
              modalContent.textContent = article.content || 'No complete content (from API)';
              modalSource.textContent = `Source: ${article.source.name}`;
              modalDate.textContent = `Date: ${new Date(article.publishedAt).toLocaleDateString()}`;
              modalLink.href = article.url;
              modal.style.display = 'flex';
          });
      });
  } catch (error) {
      console.error('Error:', error);
      newsContainer.innerHTML = `<div class="loading">Loading error: ${(error as Error).message || 'unknown error'}</div>`;
  }
}


closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e: MouseEvent) => {
  if (e.target === modal) {
      modal.style.display = 'none';
  }
});

let fontSize: number = 16;

fontSmaller.addEventListener('click', () => {
  if (fontSize > 12) {
      fontSize -= 2;
      updateFontSize();
      console.log('Reduce font size to:', fontSize);
  }
});

fontLarger.addEventListener('click', () => {
  if (fontSize < 24) {
      fontSize += 2;
      updateFontSize();
      console.log('Increase the font to:', fontSize);
  }
});

function updateFontSize(): void {
  const newsContents: NodeListOf<HTMLElement> = document.querySelectorAll('.news-content');
  console.log('The number of news-contents found:', newsContents.length);
  newsContents.forEach(content => {
      content.style.fontSize = `${fontSize}px`;
      const h2 = content.querySelector('h2');
      const p = content.querySelector('p');
      const source = content.querySelector('.source');
      const date = content.querySelector('.date');
      if (h2) h2.style.fontSize = `${fontSize + 2}px`;
      if (p) p.style.fontSize = `${fontSize}px`;
      if (source) source.style.fontSize = `${fontSize - 2}px`;
      if (date) date.style.fontSize = `${fontSize - 2}px`;
  });
  const modalContent: HTMLElement | null = document.querySelector('.modal-content');
  if (modalContent) {
      modalContent.style.fontSize = `${fontSize}px`;
      const modalH2 = modalContent.querySelector('#modal-title');
      const modalP = modalContent.querySelector('#modal-description');
      const modalC = modalContent.querySelector('#modal-content');
      const modalS = modalContent.querySelector('#modal-source');
      const modalD = modalContent.querySelector('#modal-date');
      if (modalH2) modalH2.style.fontSize = `${fontSize + 2}px`;
      if (modalP) modalP.style.fontSize = `${fontSize}px`;
      if (modalC) modalC.style.fontSize = `${fontSize}px`;
      if (modalS) modalS.style.fontSize = `${fontSize - 2}px`;
      if (modalD) modalD.style.fontSize = `${fontSize - 2}px`;
  }
}

lightMode.addEventListener('click', () => {
  document.body.classList.remove('night-mode');
});

darkMode.addEventListener('click', () => {
  document.body.classList.add('night-mode');
});

function init(): void {
  fetchNews(languageSelect.value, sortSelect.value);

  languageSelect.addEventListener('change', () => {
      fetchNews(languageSelect.value, sortSelect.value, searchInput.value.trim() || undefined);
  });

  sortSelect.addEventListener('change', () => {
      fetchNews(languageSelect.value, sortSelect.value, searchInput.value.trim() || undefined);
  });

  searchBtn.addEventListener('click', () => {
      const query: string = searchInput.value.trim();
      fetchNews(languageSelect.value, sortSelect.value, query || undefined);
  });

  searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
          const query: string = searchInput.value.trim();
          fetchNews(languageSelect.value, sortSelect.value, query || undefined);
      }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});