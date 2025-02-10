import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  summary: string;
}> {
  try {
    const prompt = `
    قم بتحليل النص التالي وتصنيفه إلى إيجابي أو سلبي أو محايد، مع إعطاء درجة من 0 إلى 1، وملخص قصير للنقاط الرئيسية:

    النص: "${text}"

    قم بإرجاع النتيجة بتنسيق JSON بالشكل التالي:
    {
      "sentiment": "positive/negative/neutral",
      "score": 0.0-1.0,
      "summary": "ملخص قصير"
    }
    `;

    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 150,
      temperature: 0.3,
    });

    const result = JSON.parse(response.data.choices[0].text.trim());
    return result;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      sentiment: 'neutral',
      score: 0.5,
      summary: 'لم نتمكن من تحليل النص',
    };
  }
}
