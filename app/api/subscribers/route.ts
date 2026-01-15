import { Novu } from "@novu/node";
import { NextRequest, NextResponse } from "next/server";

const novu = new Novu(process.env.NOVU_SECRET_KEY as string);

export async function GET(request: NextRequest) {
  try {
    const response = await novu.subscribers.list();

    // Handle different response structures
    let subscriberData = [];

    if (response && typeof response === "object") {
      // Check if data is directly an array
      if (Array.isArray(response.data)) {
        subscriberData = response.data;
      }
      // Check if data.data is an array (nested structure)
      else if (response.data && Array.isArray(response.data.data)) {
        subscriberData = response.data.data;
      }
      // Check if response itself is an array
      else if (Array.isArray(response)) {
        subscriberData = response;
      }
    }

    console.log("Fetched subscribers:", subscriberData.length);

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
