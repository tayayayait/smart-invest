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
        // URL에서 /api/yahoo-chart/ 이후의 경로를 추출
        const path = req.url?.replace('/api/yahoo-chart', '') || '';
        const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart${path}`;

        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`Yahoo Chart API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Yahoo Chart API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch chart data',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
