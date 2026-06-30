"use client";

import DIdAvatar from "./DIdAvatar";

export default function ChatInterface() {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="w-full h-full max-w-[800px] max-h-[600px]">
        <DIdAvatar />
      </div>
    </div>
  );
}
