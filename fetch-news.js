import axios from 'axios';

const apiKey = process.env.NEWS_API_KEY;
const languages = ['en', 'de', 'fr', 'es', 'it', 'ja', 'zh'];
const sortOptions = ['relevancy', 'publishedAt'];

async function fetchNews() {
    if (!apiKey) {
        throw new Error('API Key is not defined');
    }
    const newsData = {};
    let requestCount = 0;
    const maxRequests = 50; // 每 12 小时限制

    for (const lang of languages) {
        for (const sort of sortOptions) {
            if (requestCount >= maxRequests) {
                console.log('Stopping due to rate limit');
                break;
            }
            const url = `http://newsapi.org/v2/top-headlines?language=${lang}&sortBy=${sort}&apiKey=${apiKey}`;
            try {
                const response = await axios.get(url);
                newsData[`${lang}-${sort}`] = response.data;
                requestCount++;
            } catch (error) {
                console.error(`Error fetching ${lang}-${sort}:`, error.response ? error.response.data : error.message);
            }
        }
        if (requestCount >= maxRequests) break;
    }
    return newsData;
}

fetchNews()
    .then(data => process.stdout.write(JSON.stringify(data)))
    .catch(err => {
        console.error('Fetch failed:', err);
        process.exit(1);
    });