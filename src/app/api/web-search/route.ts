import fetch from 'node-fetch';
export async function POST(req: any, res) {
    const query = await req.json();
    console.log("query", query);

    try {
        const searchForResults = async (searchTerm: string) => {
            const bingSearchUrl = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(searchTerm)}&count=10&mkt=en-US`;

            const response = await fetch(bingSearchUrl, {
                method: 'GET',
                headers:  { 'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_BING_API_KEY },
            })
            if (!response.ok) {
                throw new Error('Search request failed');
              }
    
             const data = await response.json(); 
             console.log('RESPONSE', data.webPages.value);
             return data.webPages.value;
        }
        
        const searchResultsArray = query.artistNames.forEach((artist: string) => {
            const searchTerm = `${artist} concerts tickets 2024 near me`
            const searchResults = searchForResults(searchTerm);
            console.log('array results', searchResults);
            return searchResults;
        })
          
        return Response.json(searchResultsArray)
    } catch(err) {
        console.log(err);
        return Response.json({ error: 400 })
    }
}