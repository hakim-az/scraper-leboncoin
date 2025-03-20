import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, message, bearerToken } = body;

        if (!productId || !message || !bearerToken) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const response = await axios.post(
            `https://api.leboncoin.fr/api/frontend/v1/classified/${productId}/reply`,
            { message },
            {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            return NextResponse.json({ success: true, message: "Message sent!" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to send message", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
