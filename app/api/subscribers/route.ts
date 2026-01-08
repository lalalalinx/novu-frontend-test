import { Novu } from "@novu/node";
import { NextRequest, NextResponse } from "next/server";

const novu = new Novu(process.env.NOVU_SECRET_KEY as string);

export async function GET(request: NextRequest) {
  try {
    const subscribers = await novu.subscribers.list();

    // Ensure we always return an array
    const subscriberData = Array.isArray(subscribers.data) ? subscribers.data : [];

    return NextResponse.json({
      success: true,
      data: subscriberData,
      total: subscriberData.length,
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        data: [], // Always return empty array on error
      },
      { status: 500 }
    );
  }
}
