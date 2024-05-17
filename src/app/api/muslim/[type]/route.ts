import { Item } from "rss-parser";
import { parseRSS, replaceQueryParams, search } from "@/app/utils";
import { NextResponse, NextRequest } from "next/server";

type ResponseData = {
  message: string;
  total?: number;
  data?: ({
    [key: string]: any;
  } & Item)[];
};

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const CNBC_NEWS_RSS = `https://muslim.or.id/{type}/rss`;

    const url = new URL(request.url);
    const searchParams = url.searchParams.get("search");
    const result = await parseRSS({
      url: MUSLIM_RSS.replace("{type}", params.type),
    });

    const data = result.items.map((items) => {
      const image = replaceQueryParams(
        items?.enclosure?.url as string,
        "q",
        "100"
      );
      delete items.pubDate;
      delete items["content:encoded"];
      delete items["content:encodedSnippet"];
      delete items.content;
      delete items.guid;
      items.image = {
        small: items?.enclosure?.url,
        large: image,
      };
      delete items.enclosure;
      return items;
    });

    let responseData: ResponseData = {
      message: `Result of type ${params.type} article in Muslim.or.id`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      let result: Item[] = [];
      searchData.map((items) => result.push(items.item));
      responseData = {
        message: `Result of type ${params.type} article in Muslim.or.id with title search: ${searchParams}`,
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
