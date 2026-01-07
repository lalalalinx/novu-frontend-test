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

function BellComponent({ unreadCount }: { unreadCount?: number }) {
  const hasUnread = unreadCount && unreadCount > 0;

  console.log("BellComponent RENDER - unreadCount:", unreadCount, "hasUnread:", hasUnread, "timestamp:", new Date().toISOString());

  return (
    <div className={`px-4 py-2 text-sm inline-flex items-center gap-2 rounded-lg transition-colors ${hasUnread ? "bg-pink-400 hover:bg-blue-500" : "bg-gray-700 hover:bg-gray-500"}`}>
      <span className="text-white">Notifications</span>
      {hasUnread && <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{unreadCount}</span>}
    </div>
  );
}

function InboxWithBell() {
  const { notifications } = useNotifications();
  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  console.log("InboxWithBell - Total notifications:", notifications?.length, "Unread:", unreadCount);

  const [isDarkMode, setIsDarkMode] = useState(true);

  const appearance = {
    // elements: {
    //   notification: ({ notification }: { notification: any }) => {
    //     return "";
    //   },
    // },
  };

  // Memoize Inbox to prevent re-mounting on state changes
  const inboxComponent = useMemo(
    () => (
      <Inbox
        applicationIdentifier="Q9j-2L1WHqKP"
        subscriberId="e7b9d077-b16f-4c26-8382-4caf4b0ac084"
        appearance={isDarkMode ? { baseTheme: dark, ...appearance } : appearance}
        renderSubject={(notification: any) => <strong className="text-pink-500">{notification.subject.toUpperCase()}</strong>}
        // primaryColor="#F167BF"
        renderBell={() => <BellComponent unreadCount={unreadCount} />}
        renderBody={(notification: any) =>
          notification.body?.startsWith("Alert") ? (
            <div>
              <p>🔔 {notification.body}</p>
            </div>
          ) : (
            <div>
              <p>{notification.body}</p>
            </div>
          )
        }
        renderAvatar={(notification: any) => {
          if (notification?.body?.toLowerCase().includes("egat")) {
            return (
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnLfg_2hZJi5a-rrgbmS-6l2L_ke1C3MQmkA&s"
                alt="EGAT avatar"
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

          // Return default avatar rendering if no avatar
          const initials = notification.actor?.name?.charAt(0).toUpperCase() || notification.subscriber?.firstName?.charAt(0).toUpperCase() || "?";
          return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">{initials}</div>;
        }}
        // not worked ??
        renderDefaultActions={(notification: any) => {
          <div className="flex gap-2">
            <button
              className="p-1 text-green-600 hover:text-green-800"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>;
        }}
        // for แก้อะไร ui ก็ได้ ตรงนี้
        // renderNotification={(notification: any) => (
        //   <div style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px" }}>
        //     <h3>{notification.subject}</h3>
        //     <p>{notification.body}</p>
        //   </div>
        // )}
        // renderNotification={(notification: any) => {
        //   // filter based on tags
        //   if (notification.tags?.includes("custom-tag")) {
        //     return (
        //       <div>
        //         <h3>Custom Notification Subject</h3>
        //         <p>Custom Notification Body</p>
        //       </div>
        //     );
        //   }
        //   return undefined;
        // }}
      ></Inbox>
    ),
    [isDarkMode, unreadCount]
  );

  return (
    <>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"}`}
      >
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </button>
      {inboxComponent}
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
          <nav className="bg-foreground text-white flex justify-between items-center p-4 gap-4 h-16">
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
