import { Item } from "rss-parser";
import { NextResponse, NextRequest } from "next/server";

type ParsedItem = {
  title: string;
  link: string;
  creator: string;
  pubDate: string;
  categories: string[];
  description: string;
};

type ResponseData = {
  message: string;
  total?: number;
  data?: ParsedItem[];
};

export async function GET(request: NextRequest) {
  try {
    const RSS_URL = 'https://muslim.or.id/category/akidah/feed';
    const parser = new Item();
    const feed = await parser.parseURL(RSS_URL);

    const data: ParsedItem[] = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      creator: item.creator,
      pubDate: item.pubDate,
      categories: item.categories,
      description: item.contentSnippet, // atau item['content:encoded'] jika Anda ingin HTML penuh
    }));

    const responseData: ResponseData = {
      message: 'Parsed RSS Feed',
      total: data.length,
      data,
    };

    return NextResponse.json(responseData);
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      {
        message: 'Error parsing RSS Feed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
