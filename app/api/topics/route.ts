import { Novu } from "@novu/node";
import { NextRequest, NextResponse } from "next/server";

const novu = new Novu(process.env.NOVU_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicKey, subscribers } = body;

    if (!topicKey || !subscribers || !Array.isArray(subscribers)) {
      return NextResponse.json({ success: false, error: "topicKey and subscribers array are required" }, { status: 400 });
    }

    await novu.topics.addSubscribers(topicKey, {
      subscribers: subscribers,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully added ${subscribers.length} subscribers to topic "${topicKey}"`,
      topicKey: topicKey,
      subscribersCount: subscribers.length,
    });
  } catch (error) {
    console.error("Error adding subscribers to topic:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
