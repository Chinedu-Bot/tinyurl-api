import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let body;
    try {
        body = await new Promise((resolve, reject) => {
            let data = "";
            req.on("data", chunk => { data += chunk; });
            req.on("end", () => resolve(JSON.parse(data)));
            req.on("error", reject);
        });
    } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON request' });
    }

    const { url } = body;
    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        const shortUrl = await response.text();

        return res.status(200).json({ original: url, shortUrl });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to shorten URL' });
    }
}
