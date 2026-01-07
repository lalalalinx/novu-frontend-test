/* eslint-disable @typescript-eslint/no-explicit-any */
import { Novu } from "@novu/api";
import { NextResponse } from "next/server";

const novu = new Novu({
  secretKey: process.env.NOVU_SECRET_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await novu.trigger({
      workflowId: "with-nextjs-app",
      to: {
        subscriberId: "e7b9d077-b16f-4c26-8382-4caf4b0ac084",
        firstName: "lyn",
        lastName: "gmail",
        email: "kullanart.01@gmail.com",
      },
      payload: body.payload || {},
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error triggering notification:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
