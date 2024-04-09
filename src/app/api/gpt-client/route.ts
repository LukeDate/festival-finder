import { NextApiResponse } from "next";
import OpenAI from 'openai';
import fetch from 'node-fetch';


export async function POST(
    req: any,
    res: NextApiResponse<Response>
  ) {
    console.log('req body', req.body);
    const body = await req.json();
    const { artists } = body;

    const getSearchResults = await fetch('http://localhost:3000/api/web-search', {
      method: 'POST',
      body: JSON.stringify({
        artistNames: ['Lane 8', 'Bonobo']
      })
    });

    const searchResults = await getSearchResults.json();
    console.log('SEARCH RES', searchResults);
    let inputForGPT = "Organise these results into a formatted JSON with venue, date + time and location as keys:\n\n";
    const resultsArray = searchResults.forEach((result: any, index: any) => {
      inputForGPT += 
      `${index + 1}. Title: ${result.name}\nURL: ${result.url}\nDescription: ${result.snippet}\n\n`;
    });
    console.log(resultsArray);
    const query = inputForGPT;
    const openAiApiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;
    const openai = new OpenAI({
      apiKey: openAiApiKey
    })
    try {
        console.log(".......FETCH BEING CALLED........")
        const response = openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user', content: query
            }
          ],
        // temperature: 0.5,
        // max_tokens: 1,
        // n: 1,
        // stop: null
        });
        const data = await response;

        console.log(data.choices[0].message);
        return Response.json({ data: response });
    } catch (error) {
        console.log(error);
        return Response.json({ error: 400 });
    }
  }