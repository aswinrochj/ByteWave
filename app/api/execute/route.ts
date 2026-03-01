import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // 4️⃣ Prevent Undefined Body Crash
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Invalid JSON in request body' }, { status: 400 });
        }

        const { source_code, language_id, stdin } = body;

        if (!source_code) {
            return NextResponse.json({ success: false, error: 'Missing source code' }, { status: 400 });
        }

        // 1️⃣ Add Proper Environment Validation
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const apiUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';

        if (!rapidApiKey) {
            console.error('SERVER ERROR: RAPIDAPI_KEY is missing in environment variables');
            return NextResponse.json({ success: false, error: 'RapidAPI key not configured' }, { status: 500 });
        }

        let apiHost;
        try {
            apiHost = new URL(apiUrl).hostname;
        } catch (e) {
            console.error('SERVER ERROR: Invalid JUDGE0_API_URL');
            return NextResponse.json({ success: false, error: 'Judge0 API URL misconfigured' }, { status: 500 });
        }

        // 2️⃣/3️⃣ Add Safe Fetch with Response Validation
        console.log(`Executing code via Judge0: Lang ID ${language_id}`);

        try {
            const response = await fetch(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': rapidApiKey,
                    'x-rapidapi-host': apiHost,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source_code,
                    language_id,
                    stdin,
                }),
            });

            if (!response.ok) {
                const status = response.status;
                let errorMessage = 'Judge0 request failed';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }

                if (status === 401) errorMessage = "Invalid RapidAPI key or subscription issue";
                if (status === 429) errorMessage = "Rate limit exceeded for Judge0 API";

                console.error(`Judge0 API Error [${status}]:`, errorMessage);
                return NextResponse.json({ success: false, error: errorMessage }, { status });
            }

            const result = await response.json();

            // Return relevant fields
            return NextResponse.json({
                success: true,
                stdout: result.stdout,
                stderr: result.stderr,
                compile_output: result.compile_output,
                message: result.message,
                status: result.status,
                time: result.time,
                memory: result.memory,
            });

        } catch (fetchError: any) {
            console.error('Judge0 Fetch Error:', fetchError);
            return NextResponse.json({
                success: false,
                error: `Network error while reaching execution server: ${fetchError.message}`
            }, { status: 503 });
        }

    } catch (error: any) {
        console.error('Internal API route error:', error);
        return NextResponse.json({ success: false, error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}
