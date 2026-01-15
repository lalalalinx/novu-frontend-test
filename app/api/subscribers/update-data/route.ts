/* eslint-disable @typescript-eslint/no-explicit-any */
import { Novu } from "@novu/node";
import { NextRequest, NextResponse } from "next/server";

const novu = new Novu(process.env.NOVU_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriberId, data } = body;

    if (!subscriberId) {
      return NextResponse.json({ success: false, error: "subscriberId is required" }, { status: 400 });
    }

    // Update subscriber data attributes
    const result = await novu.subscribers.update(subscriberId, {
      data: data || {},
    });

    // Extract only serializable data from result
    const responseData = result?.data
      ? {
          subscriberId: result.data.subscriberId,
          email: result.data.email,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          data: result.data.data,
        }
      : { subscriberId, data };

    return NextResponse.json({
      success: true,
      message: `Successfully updated subscriber data for "${subscriberId}"`,
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating subscriber data:", error);

    // Extract error message safely without circular references
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object") {
      // Handle Axios or HTTP errors
      const err = error as any;
      errorMessage = err.response?.data?.message || err.message || errorMessage;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
