/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

// API Configuration
const apiList = [
  {
    name: "test",
    description: "test",
    endpoint: "test",
    method: "test",
    body: {
      payload: {},
    },
  },
  //apiForTriggerBasic
  {
    name: "Trigger 3 Basic Notifications",
    description: "ส่ง notification ไปยัง subscriber",
    endpoint: "/api/trigger",
    method: "POST",
    body: {
      payload: {
        message: "Test notification triggered at " + new Date().toISOString(),
      },
    },
  },
  //apiForTriggerEmail
  {
    name: "Trigger Email Workflow",
    description: "ส่ง email notification workflow (in-demo-app-email)",
    endpoint: "/api/trigger",
    method: "POST",
    body: {
      workflowId: "in-demo-app-email",
      payload: {
        firstName: "Lyn but from APP",
        message: "This is an example message from APP.",
        actionUrl: "https://www.iknowplus.co.th/",
        testPayload1: "payload.testPayload1 from APP",
      },
    },
  },
  //apiForTriggerDigest post-01
  {
    name: "Trigger Digest Workflow {title: 'กดไลค์โพสต์' by 'พี่แมว'}",
    description: "ส่ง digest notification workflow (in-demo-app-digest)",
    endpoint: "/api/trigger",
    method: "POST",
    body: {
      workflowId: "in-demo-app-digest",
      payload: {
        title: "กดไลค์โพสต์",
        name: "พี่แมว",
        imgLink:
          "https://ca-times.brightspotcdn.com/dims4/default/c76ae20/2147483647/strip/true/crop/1229x691+0+68/resize/1200x675!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F5e%2Fae%2Fd929d6764e6895b410b400b9763b%2Fhedgehog-profile-lead.jpg",
      },
    },
  },
  {
    name: "Trigger Digest Workflow {title: 'กดไลค์โพสต์' by 'พี่ปลา'}",
    description: "ส่ง digest notification workflow (in-demo-app-digest)",
    endpoint: "/api/trigger",
    method: "POST",
    body: {
      workflowId: "in-demo-app-digest",
      payload: {
        title: "กดไลค์โพสต์",
        name: "พี่ปลา",
        imgLink:
          "https://ca-times.brightspotcdn.com/dims4/default/c76ae20/2147483647/strip/true/crop/1229x691+0+68/resize/1200x675!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F5e%2Fae%2Fd929d6764e6895b410b400b9763b%2Fhedgehog-profile-lead.jpg",
      },
    },
  },
  //apiForTriggerDigest post-02
  {
    name: "Trigger Digest Workflow {title: 'แชร์โพสต์' by 'พี่นก'}",
    description: "ส่ง digest notification workflow (in-demo-app-digest)",
    endpoint: "/api/trigger",
    method: "POST",
    body: {
      workflowId: "in-demo-app-digest",
      payload: {
        title: "กดไลค์โพสต์",
        name: "พี่นก",
        imgLink: "https://miro.medium.com/v2/resize:fit:1400/1*lWaZtVU68iEnua9JgVt1GQ.jpeg",
      },
    },
  },
  {
    name: "Trigger Digest Workflow {title: 'แชร์โพสต์' by 'พี่ต่าย'}",
    description: "ส่ง digest notification workflow (in-demo-app-digest)",
    endpoint: "/api/trigger",
    method: "POST",
    body: {
      workflowId: "in-demo-app-digest",
      payload: {
        title: "แชร์โพสต์",
        name: "พี่ต่าย",
        imgLink: "https://miro.medium.com/v2/resize:fit:1400/1*lWaZtVU68iEnua9JgVt1GQ.jpeg",
      },
    },
  },

  // เดี๋ยวจะมี API อื่นๆ เพิ่มที่นี่
];

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [openResults, setOpenResults] = useState<Set<string>>(new Set());

  const callApi = async (api: (typeof apiList)[0]) => {
    setLoading(api.name);

    try {
      const response = await fetch(api.endpoint, {
        method: api.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(api.body),
      });

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        [api.name]: {
          success: true,
          api: {
            name: api.name,
            description: api.description,
            endpoint: api.endpoint,
            method: api.method,
            body: api.body,
          },
          response: data,
        },
      }));

      // Auto open result after API call
      setOpenResults((prev) => {
        const next = new Set(prev);
        next.add(api.name);
        return next;
      });
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [api.name]: {
          success: false,
          api: {
            name: api.name,
            description: api.description,
            endpoint: api.endpoint,
            method: api.method,
            body: api.body,
          },
          error: String(error),
        },
      }));

      // Auto open result even on error
      setOpenResults((prev) => {
        const next = new Set(prev);
        next.add(api.name);
        return next;
      });
    } finally {
      setLoading(null);
    }
  };

  const toggleResult = (apiName: string) => {
    setOpenResults((prev) => {
      const next = new Set(prev);
      if (next.has(apiName)) {
        next.delete(apiName);
      } else {
        next.add(apiName);
      }
      return next;
    });
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Novu API Testing</h1>

      <div className="flex flex-col gap-6">
        {apiList.map((api, index) => (
          <div
            key={api.name}
            className="flex flex-col gap-3"
          >
            {/* API Button with Call and Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => callApi(api)}
                disabled={loading === api.name}
                className="flex-1 text-start px-4 py-3 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading === api.name ? "Loading..." : api.name}
              </button>
              <button
                onClick={() => toggleResult(api.name)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {openResults.has(api.name) ? "▼" : "▶"}
              </button>
            </div>

            {/* Result Section */}
            {openResults.has(api.name) && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="font-bold text-lg text-blue-700 mb-3">{api.name}</h2>

                <div className="mb-3 p-3 bg-gray-100 rounded">
                  <h3 className="font-semibold text-sm mb-2">Request:</h3>
                  {results[api.name] ? (
                    <>
                      <p className="text-xs">
                        <span className="font-mono font-bold">{results[api.name].api.method}</span> {results[api.name].api.endpoint}
                      </p>
                      <pre className="overflow-auto text-xs mt-2 p-2 bg-white rounded max-h-[500px]">{JSON.stringify(results[api.name].api.body, null, 2)}</pre>
                    </>
                  ) : (
                    <pre className="overflow-auto text-xs p-2 bg-white rounded max-h-[500px]">null</pre>
                  )}
                </div>

                <div className="mb-3 p-3 bg-gray-100 rounded">
                  <h3 className="font-semibold text-sm mb-2">Response:</h3>
                  {results[api.name] ? (
                    <pre className="overflow-auto text-xs mt-2 p-2 bg-white rounded max-h-[500px]">{JSON.stringify(results[api.name].response || results[api.name].error, null, 2)}</pre>
                  ) : (
                    <pre className="overflow-auto text-xs mt-2 p-2 bg-white rounded max-h-[500px]">null</pre>
                  )}
                </div>
              </div>
            )}

            {/* Separator line (not after last item) */}
            {index < apiList.length - 1 && <hr className="border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  );
}
