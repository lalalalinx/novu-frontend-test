/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inbox, Bell, NovuProvider, useNotifications, Notifications, InboxContent } from "@novu/react";
import { dark } from "@novu/react/themes";
import { Archive, Check } from "lucide-react";
import "./globals.css";

const tagsMap: {
  [key: string]: {
    icon: string;
    tags: string[];
    subjectTextStyle?: string;
    contentTextStyle?: string;
  };
} = {
  talkCloud: {
    icon: "💬",
    tags: ["social", "chat", "message"],
  },
  siren: {
    icon: "🚨",
    tags: ["bug"],
    subjectTextStyle: "text-red-200",
    contentTextStyle: "text-white-100",
  },
  information: {
    icon: "ℹ️",
    tags: ["info", "information"],
  },
  warning: {
    icon: "⚠️",
    tags: ["warning", "alert"],
  },
  success: {
    icon: "✅",
    tags: ["success", "done", "completed"],
  },
};

function BellComponent({ unreadCount }: { unreadCount?: number }) {
  const hasUnread = typeof unreadCount === "number" && unreadCount > 0;

  console.log("BellComponent RENDER - unreadCount:", unreadCount, "hasUnread:", hasUnread, "timestamp:", new Date().toISOString());

  return (
    <div className="relative inline-block min-w-[120px]">
      <div
        className={`py-2 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition-colors w-full ${hasUnread ? "bg-pink-400 hover:bg-blue-500" : "bg-gray-700 hover:bg-gray-500"}`}
      >
        <span className="text-white">Notifications</span>
      </div>
      {hasUnread && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{unreadCount}</span>}
    </div>
  );
}

function InboxWithBell() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleNotificationClick = (notification: any) => {
    console.log("🖱️ Notification clicked:", notification);

    // Extract imageLink from body
    const imageLink = (notification.body || "").split("{image link:")[1]?.split("}")[0]?.trim();

    if (imageLink) {
      console.log("🔗 Opening link:", imageLink);
      window.open(imageLink, "_blank");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"}`}
      >
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </button>
      <Inbox
        applicationIdentifier="Q9j-2L1WHqKP"
        subscriberId="e7b9d077-b16f-4c26-8382-4caf4b0ac084"
        appearance={isDarkMode ? { baseTheme: dark } : {}}
        onNotificationClick={handleNotificationClick}
        renderBell={(props: any) => {
          console.log("🔔 renderBell - total:", props?.total);
          return <BellComponent unreadCount={props?.total || 0} />;
        }}
        renderSubject={(notification: any) => {
          console.log("📝 notification.tags:", notification.tags);

          // Find matching icon and style from tagsMap
          let iconToShow = "";
          let subjectStyle = "text-pink-500";
          if (notification.tags) {
            for (const key in tagsMap) {
              const hasMatch = notification.tags.some((tag: string) => tagsMap[key].tags.includes(tag));
              if (hasMatch) {
                iconToShow = tagsMap[key].icon;
                if (tagsMap[key].subjectTextStyle) {
                  subjectStyle = tagsMap[key].subjectTextStyle!;
                }
                break;
              }
            }
          }
          return (
            <strong className={subjectStyle}>
              {iconToShow && `${iconToShow} `}
              {notification.subject.toUpperCase()}
            </strong>
          );
        }}
        renderBody={(notification: any) => {
          const bodyText = (notification.body || "")
            .replace(/\\n/g, "\n")
            .replace(/{image link:.*?}/, "")
            .trim();

          const imageLink = (notification.body || "").split("{image link:")[1]?.split("}")[0]?.trim();

          // Find matching content style from tagsMap
          let contentStyle = "";
          if (notification.tags) {
            for (const key in tagsMap) {
              const hasMatch = notification.tags.some((tag: string) => tagsMap[key].tags.includes(tag));
              if (hasMatch && tagsMap[key].contentTextStyle) {
                contentStyle = tagsMap[key].contentTextStyle!;
                break;
              }
            }
          }

          return (
            <div>
              <p
                style={{ whiteSpace: "pre-line" }}
                className={contentStyle}
              >
                {bodyText}
              </p>
              {notification?.tags?.includes("image") && imageLink && (
                <div className="flex justify-center mt-2">
                  <img
                    src={imageLink}
                    alt="Notification Image"
                    className="rounded"
                    style={{ maxHeight: "100px", maxWidth: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          );
        }}
        renderAvatar={(notification: any) => {
          if (notification?.body?.toLowerCase().includes("ikp")) {
            return (
              <img
                src="https://www.iknowplus.co.th/favicon.ico"
                alt="IKP avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            );
          }

          if (notification.avatar) {
            return (
              <img
                src={notification.avatar}
                alt="Avatar"
                className="rounded-full object-cover"
                style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", maxWidth: "32px", maxHeight: "32px" }}
              />
            );
          }

          const initials = notification.actor?.name?.charAt(0).toUpperCase() || notification.subscriber?.firstName?.charAt(0).toUpperCase() || "?";
          return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">{initials}</div>;
        }}
      />
    </>
  );
}

// const appearance = {
//   variables: {
//     // colorBackground: "#EDC2F2",
//     // borderRadius: "8px",
//     colorPrimaryForeground: "#F167BF",
//     bellIcon: "#FFFFFF",
//     elements: {
//       notification: "bg-red rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50",
//       bellIcon: "bg-white",
//       borderRadius: "round-lg",
//     },
//   },
// };

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export const metadata = {
//   title: "Novu Next.js Quickstart",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="">
        <NovuProvider
          applicationIdentifier="Q9j-2L1WHqKP"
          subscriberId="e7b9d077-b16f-4c26-8382-4caf4b0ac084"
        >
          <nav className="bg-foreground text-white flex justify-between items-center py-4 pr-2 pl-4 gap-4 h-16">
            <InboxWithBell />
          </nav>
          {children}
          {/* <Inbox
            applicationIdentifier="Q9j-2L1WHqKP"
            subscriberId="e7b9d077-b16f-4c26-8382-4caf4b0ac084"
            // appearance={isDarkMode ? { baseTheme: dark, ...appearance } : appearance}
            // renderBell={() => <BellComponent unreadCount={unreadCount} />}
          >
            <Notifications />
          </Inbox> */}
        </NovuProvider>
      </body>
    </html>
  );
}
