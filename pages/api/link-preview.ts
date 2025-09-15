import axios from 'axios';
import * as cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { url } = req.query;

	if (!url || typeof url !== 'string') {
		return res.status(400).json({ error: 'Missing url' });
	}

	function getFileType(url: string): 'image' | 'file' | 'link' {
		try {
			const ext = url.split('?')[0].split('.').pop()?.toLowerCase();

			if (!ext) return 'link';

			if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
			if (['pdf'].includes(ext)) return 'file';
			if (['doc', 'docx'].includes(ext)) return 'file';

			return 'link';
		} catch {
			return 'link';
		}
	}

	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const title =
			$("meta[property='og:title']").attr('content') ||
			$('title').text() ||
			url.split('-')[3];
		const description =
			$("meta[property='og:description']").attr('content') ||
			$("meta[name='description']").attr('content');
		const image = $("meta[property='og:image']").attr('content');
		const favicon = $("link[rel='icon']").attr('href');
		const type = getFileType(url);

		res.json({
			title: title,
			description: description ?? null,
			image: image ?? null,
			favicon: favicon ?? null,
			url,
			type,
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch preview' });
	}
}
