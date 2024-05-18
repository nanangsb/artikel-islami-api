import { Item } from "rss-parser";
import { parseRSS, search } from "@/app/utils";
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
    const PENGUSAHA_NEWS_RSS = `http://pengusahamuslim.com/category/{type}/feed`;

    const url = new URL(request.url);
    const searchParams = url.searchParams.get("search");
    const result = await parseRSS({
      url: PENGUSAHA_NEWS_RSS.replace("{type}", params.type),
    });

    const data = result.items.map((items) => {
      delete items["dc:creator"];
      delete items.guid;
      delete items.categories;
      delete items.pubDate;
      delete items.creator;
      delete items.comments;
      delete items.content;
      return items;
    });

    let responseData: ResponseData = {
      message: `Result of type ${params.type} articles in Pengusaha Muslim`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      let result: Item[] = [];
      searchData.map((items) => result.push(items.item));
      responseData = {
        message: `Result of type ${params.type} articles in Pengusaha Muslim with title search: ${searchParams}`,
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
