import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, filters, payload } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Workflow name is required" }, { status: 400 });
    }

    // Trigger broadcast event using REST API
    const response = await fetch("https://api.novu.co/v1/events/trigger/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${process.env.NOVU_SECRET_KEY}`,
      },
      body: JSON.stringify({
        name: name,
        filters: filters || [],
        payload: payload || {},
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to trigger broadcast",
          details: result,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully triggered broadcast workflow "${name}"`,
      data: result,
    });
  } catch (error) {
    console.error("Error triggering broadcast:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
