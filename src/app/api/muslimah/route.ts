import { parseRSS, search } from "@/app/utils";
import { NextResponse, NextRequest } from "next/server";
import { Item } from "rss-parser";

const limitString = (str: string, limit: number): string => {
  const string: string = str;
  const length: number = limit;
  const result: string =
    string.length > length ? string.substring(0, length) + "...." : string;
  return result;
};

export async function GET(request: NextRequest) {
  try {
    const MUSLIMAH_NEWS_RSS = "https://muslimah.or.id/feed";
    const url = new URL(request.url);
    const searchParams = url.searchParams.get("search");
    const result = await parseRSS({
      url: MUSLIMAH_NEWS_RSS,
    });

    const data = result.items.map((items) => {
      delete items.creator;
      delete items.pubDate;
      delete items.author;
      delete items["dc:creator"];
      delete items.content;
      delete items.guid;
      delete items.categories;
      delete items.comments;
      delete items.description;
      return items;
    });

    let responseData = {
      messages: "Result of all article in Muslimah.or.id",
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      let result: Item[] = [];
      searchData.map((items) => result.push(items.item));
      responseData = {
        messages: `Result of all article in Muslimah.or.id with title search: ${searchParams}`,
        total: searchData.length,
        data: result,
      };
    }

    return NextResponse.json(responseData);
  } catch (e) {
    return NextResponse.json(
      {
        message: "Something error",
      },
      { status: 400 }
    );
  }
}
