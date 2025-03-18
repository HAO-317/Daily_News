const axios = require('axios');

const apiKey = process.env.NEWS_API_KEY;
const languages = ['en', 'de', 'fr', 'es', 'it', 'jp', 'zh']; 
const sortOptions = ['relevancy', 'publishedAt'];

async function fetchNews() {
    const newsData = {};
    for (const lang of languages) {
        for (const sort of sortOptions) {
            const url = `http://newsapi.org/v2/top-headlines?language=${lang}&sortBy=${sort}&apiKey=${apiKey}`;
            try {
                const response = await axios.get(url);
                newsData[`${lang}-${sort}`] = response.data;
            } catch (error) {
                console.error(`Error fetching ${lang}-${sort}:`, error.message);
            }
        }
    }
    console.log(JSON.stringify(newsData));
}

fetchNews();