import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { query, display = '20', start = '1', sort = 'date' } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const clientId = process.env.NAVER_CLIENT_ID;
        const clientSecret = process.env.NAVER_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return res.status(500).json({
                error: 'Naver API credentials not configured'
            });
        }

        const params = new URLSearchParams({
            query,
            display: String(Math.min(Math.max(Number(display), 1), 100)),
            start: String(Math.min(Math.max(Number(start), 1), 1000)),
            sort: typeof sort === 'string' ? sort : 'date',
        });

        const apiUrl = `https://openapi.naver.com/v1/search/news.json?${params}`;

        const response = await fetch(apiUrl, {
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret,
            },
        });

        if (!response.ok) {
            throw new Error(`Naver API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Naver News API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch news',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
