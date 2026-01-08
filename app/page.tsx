/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

// API Configuration
const apiList = [
  //apiForTriggerBasic
  {
    name: "3 Basic Notifications",
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
    name: "Email Workflow",
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
    name: "Digest Workflow {title: 'กดไลค์โพสต์' by 'พี่แมว'}",
    description: "Digest = รวมแล้วส่งทีเดียว (in-demo-app-digest)",
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
    name: "Digest Workflow {title: 'กดไลค์โพสต์' by 'พี่ปลา'}",
    description: "Digest = รวมแล้วส่งทีเดียว (in-demo-app-digest)",
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
    name: "Digest Workflow {title: 'แชร์โพสต์' by 'พี่นก'}",
    description: "Digest = รวมแล้วส่งทีเดียว (in-demo-app-digest)",
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
    name: "Digest Workflow {title: 'แชร์โพสต์' by 'พี่ต่าย'}",
    description: "Digest = รวมแล้วส่งทีเดียว (in-demo-app-digest)",
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

  //throttled to avoid too many APIs
  {
    name: "Throttled",
    description: "จำกัดความถี่ในการส่ง notification ซ้ำๆ / Throttle = ซ้ำแล้วไม่ส่งถี่ (in-demo-app-throttle)",
    endpoint: "/api/trigger",
    method: "POST",
    body: {
      workflowId: "in-app-demo-throttle",
      payload: {},
    },
  },
];

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [openResults, setOpenResults] = useState<Set<string>>(new Set());
  const [msTeamsLoading, setMsTeamsLoading] = useState(false);
  const [msTeamsResult, setMsTeamsResult] = useState<any>(null);
  const [subscriberId, setSubscriberId] = useState("895c2ec2-35a5-4f35-94e3-556652bde8e1");
  const [msChatLoading, setMsChatLoading] = useState(false);
  const [msChatResult, setMsChatResult] = useState<any>(null);

  // Subscribers state
  const [subscriberlist, setSubscriberlist] = useState<any[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);
  const [addedToTopicCount, setAddedToTopicCount] = useState<number | null>(null);

  // Topics state
  const [topicKey, setTopicKey] = useState("admins");
  const [subscriberInputs, setSubscriberInputs] = useState(["31cd5594-f77f-4986-b377-a7f06aa6d28b", "e7b9d077-b16f-4c26-8382-4caf4b0ac084", "895c2ec2-35a5-4f35-94e3-556652bde8e1"]);
  const [topicLoading, setTopicLoading] = useState(false);
  const [topicResult, setTopicResult] = useState<any>(null);

  // Topic Trigger state
  const [topicTriggerWorkflowId, setTopicTriggerWorkflowId] = useState("in-app-demo-admins");
  const [topicTriggerKey, setTopicTriggerKey] = useState("admins");
  const [topicTriggerLoading, setTopicTriggerLoading] = useState(false);
  const [topicTriggerResult, setTopicTriggerResult] = useState<any>(null);
  const [topicSectionOpen, setTopicSectionOpen] = useState(true);
  const [apiSectionOpen, setApiSectionOpen] = useState(true);
  const [chatSectionOpen, setChatSectionOpen] = useState(true);
  const [apiSubscriberIds, setApiSubscriberIds] = useState<Record<string, string>>({});

  // Fetch subscribers on mount
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch("/api/subscribers");
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data)) {
          setSubscriberlist(data.data);
        } else {
          console.error("Invalid subscribers data:", data);
          setSubscriberlist([]);
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        setSubscriberlist([]);
      } finally {
        setSubscribersLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const updateMsTeamsWebhook = async () => {
    setMsTeamsLoading(true);
    try {
      const response = await fetch("/api/update-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriberId: subscriberId,
          webhookUrl:
            "https://ikpo365.webhook.office.com/webhookb2/1ea8eaf8-c196-43fd-b1f7-fc90e804d8ce@8fdc8fed-4de1-40ca-895c-530f0727f281/IncomingWebhook/f8ebe692b51342a3a15a9d73bf44363b/766baf08-722c-405e-9085-6ee0e8bc938b/V2d6kPC_oMz4eBJKg9Ojy0REAs9CFzqEojUXEHt7IaUA41",
          providerId: "msteams",
          integrationIdentifier: "msteams",
        }),
      });
      const data = await response.json();
      setMsTeamsResult(data);
    } catch (error) {
      setMsTeamsResult({ success: false, error: String(error) });
    } finally {
      setMsTeamsLoading(false);
    }
  };

  const triggerMsTeamsChat = async () => {
    setMsChatLoading(true);
    try {
      const response = await fetch("/api/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflowId: "in-app-demo-chat",
          payload: {},
          subscriberId: subscriberId,
        }),
      });
      const data = await response.json();
      setMsChatResult(data);
    } catch (error) {
      setMsChatResult({ success: false, error: String(error) });
    } finally {
      setMsChatLoading(false);
    }
  };

  const addSubscriberInput = () => {
    setSubscriberInputs([...subscriberInputs, ""]);
  };

  const removeSubscriberInput = (index: number) => {
    setSubscriberInputs(subscriberInputs.filter((_, i) => i !== index));
  };

  const updateSubscriberInput = (index: number, value: string) => {
    const newInputs = [...subscriberInputs];
    newInputs[index] = value;
    setSubscriberInputs(newInputs);
  };

  const addSubscribersToTopic = async () => {
    setTopicLoading(true);
    try {
      const validSubscribers = subscriberInputs.filter((s) => s.trim() !== "");
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicKey: topicKey,
          subscribers: validSubscribers,
        }),
      });
      const data = await response.json();
      setTopicResult(data);

      // Set the count of subscribers added on success
      if (data.success) {
        setAddedToTopicCount(validSubscribers.length);
      }
    } catch (error) {
      setTopicResult({ success: false, error: String(error) });
    } finally {
      setTopicLoading(false);
    }
  };

  const triggerTopicNotification = async () => {
    setTopicTriggerLoading(true);
    try {
      const response = await fetch("/api/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflowId: topicTriggerWorkflowId,
          to: { type: "topic", topicKey: topicTriggerKey },
          payload: { title: "แจ้งเตือนแอดมิน" },
        }),
      });
      const data = await response.json();
      setTopicTriggerResult(data);
    } catch (error) {
      setTopicTriggerResult({ success: false, error: String(error) });
    } finally {
      setTopicTriggerLoading(false);
    }
  };

  const callApi = async (api: (typeof apiList)[0]) => {
    setLoading(api.name);

    try {
      // Find subscriber data if ID is provided
      let subscriberData = null;
      if (apiSubscriberIds[api.name]) {
        const foundSubscriber = subscriberlist.find((sub) => sub.subscriberId === apiSubscriberIds[api.name]);
        if (foundSubscriber) {
          subscriberData = {
            subscriberId: foundSubscriber.subscriberId,
            email: foundSubscriber.email,
            ...(foundSubscriber.firstName && { firstName: foundSubscriber.firstName }),
            ...(foundSubscriber.lastName && { lastName: foundSubscriber.lastName }),
          };
        }
      }

      // Only include subscriberId (not email/firstName/lastName to avoid updating subscriber data)
      const requestBody = {
        ...api.body,
        subscriberId: subscriberData?.subscriberId || apiSubscriberIds[api.name] || subscriberlist[0]?.subscriberId,
      };

      const response = await fetch(api.endpoint, {
        method: api.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
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
            body: requestBody,
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
      {/* <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h2 className="text-sm font-semibold mb-2 text-purple-800">📋 Subscriber IDs Reference</h2>
        {subscribersLoading ? (
          <div className="text-xs text-gray-500">Loading subscribers...</div>
        ) : (
          <>
            <div className="text-xs font-semibold text-purple-700 mb-3">Result: {subscriberlist.length} คน</div>
            {subscriberlist.length === 0 ? (
              <div className="text-xs text-gray-500">ไม่มี subscribers</div>
            ) : (
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                {subscriberlist.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <span className="text-purple-600">{sub.subscriberId}</span>
                    <span className="text-gray-500">{sub.email}</span>
                    {sub.firstName && (
                      <span className="text-gray-400">
                        ({sub.firstName} {sub.lastName})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div> */}
      {/* Topics Management */}
      <div className="mb-5 bg-green-50 rounded-lg border border-green-200">
        <div className="flex gap-2 p-2">
          <button
            onClick={() => setTopicSectionOpen(!topicSectionOpen)}
            className="flex-1 text-start text-lg font-semibold text-green-800 hover:text-green-900 transition-colors"
          >
            🏷️ Topic
          </button>
          <button
            onClick={() => setTopicSectionOpen(!topicSectionOpen)}
            className="px-2 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            {topicSectionOpen ? "▼" : "▶"}
          </button>
        </div>

        {topicSectionOpen && (
          <div className="px-4 pb-4">
            <h2 className="text-sm font-semibold mb-3 text-green-800">Add Subscribers to Topic</h2>

            {/* Topic Key Input */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Topic Key (Tags)</label>
              <input
                type="text"
                value={topicKey}
                onChange={(e) => setTopicKey(e.target.value)}
                placeholder="Topic key (e.g., admins)"
                className="px-3 py-2 text-sm border border-gray-300 rounded w-full font-mono"
              />
            </div>

            {/* Subscriber Inputs */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 mb-2 block">Subscriber IDs</label>
              <div className="space-y-2">
                {subscriberInputs.map((subscriber, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={subscriber}
                      onChange={(e) => updateSubscriberInput(index, e.target.value)}
                      placeholder="Subscriber ID"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded font-mono"
                    />
                    {subscriberInputs.length > 1 && (
                      <button
                        onClick={() => removeSubscriberInput(index)}
                        className="px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addSubscriberInput}
                className="mt-2 px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                + Add Subscriber
              </button>
            </div>

            {/* Request Preview */}
            <div className="mb-3 p-3 bg-gray-100 rounded">
              <h3 className="font-semibold text-xs mb-2 text-gray-700">Request Body:</h3>
              <pre className="overflow-auto text-xs p-2 bg-white rounded max-h-[200px]">
                {JSON.stringify(
                  {
                    topicKey: topicKey,
                    subscribers: subscriberInputs.filter((s) => s.trim() !== ""),
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Add to Topic Button */}
            <button
              onClick={addSubscribersToTopic}
              disabled={topicLoading}
              className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {topicLoading ? "Adding to Topic..." : "Add Subscribers to Topic"}
            </button>

            {/* Result */}
            {topicResult && (
              <div className="mt-3">
                <span className={`text-xs ${topicResult.success ? "text-green-600" : "text-red-600"}`}>{topicResult.success ? `✓ ${topicResult.message}` : `✗ ${topicResult.error}`}</span>
                <pre className="mt-2 text-xs p-2 bg-white rounded border border-gray-200 overflow-auto max-h-[150px]">{JSON.stringify(topicResult, null, 2)}</pre>
              </div>
            )}

            {/* Divider */}
            <hr className="my-5 border-green-300" />

            {/* Trigger Topic Notification */}
            <h2 className="text-sm font-semibold mb-3 text-green-800">Trigger Topic Notification</h2>

            {/* Workflow ID Input */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Workflow ID</label>
              <input
                type="text"
                value={topicTriggerWorkflowId}
                onChange={(e) => setTopicTriggerWorkflowId(e.target.value)}
                placeholder="in-app-demo-admins"
                className="px-3 py-2 text-sm border border-gray-300 rounded w-full font-mono"
              />
            </div>

            {/* Topic Key Input */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Topic Key</label>
              <input
                type="text"
                value={topicTriggerKey}
                onChange={(e) => setTopicTriggerKey(e.target.value)}
                placeholder="admins"
                className="px-3 py-2 text-sm border border-gray-300 rounded w-full font-mono"
              />
            </div>

            {/* Request Preview */}
            <div className="mb-3 p-3 bg-gray-100 rounded">
              <h3 className="font-semibold text-xs mb-2 text-gray-700">Request Body:</h3>
              <pre className="overflow-auto text-xs p-2 bg-white rounded max-h-[200px]">
                {JSON.stringify(
                  {
                    workflowId: topicTriggerWorkflowId,
                    to: { type: "topic", topicKey: topicTriggerKey },
                    payload: {},
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Trigger Button */}
            <div className="flex gap-2">
              <button
                onClick={triggerTopicNotification}
                disabled={topicTriggerLoading}
                className="flex-1 text-start text-sm px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {topicTriggerLoading ? "Triggering..." : "Trigger Notification to Topic"}
              </button>
            </div>

            {/* Result */}
            {topicTriggerResult && (
              <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                <span className={`text-xs font-semibold ${topicTriggerResult.success !== false ? "text-green-600" : "text-red-600"}`}>
                  {topicTriggerResult.success !== false ? "✓ Sent Successfully" : `✗ Failed`}
                </span>
                <pre className="mt-2 text-xs overflow-auto max-h-[150px]">{JSON.stringify(topicTriggerResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
      {/*   name: api.name,
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

      {/* Chat Section */}
      <div className="mb-5 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex gap-2 p-2">
          <button
            onClick={() => setChatSectionOpen(!chatSectionOpen)}
            className="flex-1 text-start text-lg font-semibold text-orange-800 hover:text-orange-900 transition-colors"
          >
            💬 Chat
          </button>
          <button
            onClick={() => setChatSectionOpen(!chatSectionOpen)}
            className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            {chatSectionOpen ? "▼" : "▶"}
          </button>
        </div>

        {chatSectionOpen && (
          <div className="px-4 pb-4">
            {/* MS Teams Webhook Setup */}
            <div className="mb-4">
              <h2 className="text-sm font-semibold mb-2 text-orange-800">MS Teams Webhook Setup</h2>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="text"
                  value={subscriberId}
                  onChange={(e) => setSubscriberId(e.target.value)}
                  placeholder="Subscriber ID"
                  className="px-2 py-1 text-xs border border-gray-300 rounded w-80 font-mono"
                />
                <button
                  onClick={updateMsTeamsWebhook}
                  disabled={msTeamsLoading}
                  className="px-3 py-1.5 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {msTeamsLoading ? "Updating..." : "🔗 Update MS Teams Webhook"}
                </button>
                {msTeamsResult && <span className={`text-xs ${msTeamsResult.success ? "text-green-600" : "text-red-600"}`}>{msTeamsResult.success ? "✓ Updated" : "✗ Failed"}</span>}
              </div>
              {msTeamsResult && <pre className="text-xs p-2 bg-white rounded border border-gray-200 overflow-auto max-h-[100px]">{JSON.stringify(msTeamsResult, null, 2)}</pre>}
            </div>

            {/* MS Teams Chat Trigger */}
            <div>
              <h2 className="text-sm font-semibold mb-2 text-orange-800">Trigger MS Teams Chat</h2>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={triggerMsTeamsChat}
                  disabled={msChatLoading}
                  className="px-3 py-1.5 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {msChatLoading ? "Sending..." : "Trigger MS Teams Chat"}
                </button>
                <span className="text-xs text-gray-600">Subscriber: {subscriberId.slice(0, 8)}...</span>
                {msChatResult && <span className={`text-xs ${msChatResult.success !== false ? "text-green-600" : "text-red-600"}`}>{msChatResult.success !== false ? "Sent" : "Failed"}</span>}
              </div>
              {msChatResult && <pre className="text-xs p-2 bg-white rounded border border-gray-200 overflow-auto max-h-[100px]">{JSON.stringify(msChatResult, null, 2)}</pre>}
            </div>
          </div>
        )}
      </div>

      {/* API Testing Section */}
      <div className="mb-5 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex gap-2 p-2">
          <button
            onClick={() => setApiSectionOpen(!apiSectionOpen)}
            className="flex-1 text-start text-lg font-semibold text-blue-800 hover:text-blue-900 transition-colors"
          >
            API Testing
          </button>
          <button
            onClick={() => setApiSectionOpen(!apiSectionOpen)}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {apiSectionOpen ? "▼" : "▶"}
          </button>
        </div>

        {apiSectionOpen && (
          <div className="px-4 pb-4">
            <div className="flex flex-col gap-6">
              {apiList.map((api, index) => (
                <div
                  key={api.name}
                  className="flex flex-col gap-3"
                >
                  {/* Subscriber ID Input */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Subscriber ID:</label>
                    <input
                      type="text"
                      value={apiSubscriberIds[api.name] || ""}
                      onChange={(e) => setApiSubscriberIds({ ...apiSubscriberIds, [api.name]: e.target.value })}
                      placeholder="Optional subscriber ID"
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                    />
                  </div>

                  {/* API Button with Call and Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => callApi(api)}
                      disabled={loading === api.name}
                      className="flex-1 text-start text-xs px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors "
                    >
                      {loading === api.name ? "Loading..." : api.name}
                    </button>
                    <button
                      onClick={() => toggleResult(api.name)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
        )}
      </div>
    </div>
  );
}
