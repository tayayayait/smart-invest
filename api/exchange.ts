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
        const { authkey, data = 'AP01', searchdate } = req.query;

        // authkey는 클라이언트에서 전달하거나 환경변수에서 가져옴
        const apiKey = (authkey as string) || process.env.VITE_EXIM_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'Exim API key not configured'
            });
        }

        const params = new URLSearchParams({
            authkey: apiKey,
            data: typeof data === 'string' ? data : 'AP01',
        });

        if (searchdate && typeof searchdate === 'string') {
            params.set('searchdate', searchdate.replace(/-/g, ''));
        }

        const apiUrl = `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?${params}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Exim API error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Exchange API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch exchange rates',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
