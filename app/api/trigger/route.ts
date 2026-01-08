/* eslint-disable @typescript-eslint/no-explicit-any */
import { Novu } from "@novu/api";
import { NextResponse } from "next/server";

const novu = new Novu({
  secretKey: process.env.NOVU_SECRET_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support both topic and subscriber targeting
    let toConfig: any;

    if (body.to && body.to.type === "topic") {
      // Topic targeting
      toConfig = [
        {
          type: "Topic",
          topicKey: body.to.topicKey,
        },
      ];
    } else {
      // Subscriber targeting - ONLY send subscriberId to avoid updating subscriber data
      toConfig = {
        subscriberId: body.subscriberId || "e7b9d077-b16f-4c26-8382-4caf4b0ac084",
      };
    }

    const result = await novu.trigger({
      workflowId: body.workflowId || "with-nextjs-app",
      to: toConfig,
      payload: body.payload || {},
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error triggering notification:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
