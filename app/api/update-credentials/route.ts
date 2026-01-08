/* eslint-disable @typescript-eslint/no-explicit-any */
import { Novu } from "@novu/api";
import { ChatOrPushProviderEnum } from "@novu/api/models/components";
import { NextResponse } from "next/server";

const novu = new Novu({
  secretKey: process.env.NOVU_SECRET_KEY,
});

//ใส่ webhookUrl ให้ subscriber
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscriberId, webhookUrl, providerId, integrationIdentifier } = body;

    const result = await novu.subscribers.credentials.update(
      {
        providerId: providerId || ChatOrPushProviderEnum.Msteams,
        credentials: {
          webhookUrl: webhookUrl,
        },
        integrationIdentifier: integrationIdentifier || "chat-webhook-ms-team",
      },
      subscriberId
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error updating credentials:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
