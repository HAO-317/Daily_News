import axios from 'axios';

const apiKey = process.env.NEWS_API_KEY;
const languages = ['en']; 
const sortOptions = ['relevancy', 'publishedAt'];

// const languages = ['en', 'de', 'fr', 'es', 'it', 'ja', 'zh'];



async function fetchNews() {
    if (!apiKey) {
        throw new Error('API Key is not defined');
    }
    const newsData = {};
    for (const lang of languages) {
        for (const sort of sortOptions) {
            const url = `http://newsapi.org/v2/top-headlines?language=${lang}&sortBy=${sort}&apiKey=${apiKey}`;
            try {
                const response = await axios.get(url);
                newsData[`${lang}-${sort}`] = response.data;
            } catch (error) {
                console.error(`Error fetching ${lang}-${sort}:`, error.response ? error.response.data : error.message);
            }
        }
    }
    return newsData;
}

fetchNews()
    .then(data => process.stdout.write(JSON.stringify(data)))
    .catch(err => {
        console.error('Fetch failed:', err);
        process.exit(1);
    });