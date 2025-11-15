import React from 'react';
import { useDashboard } from './DashboardContext';
import InlineChat from "../../components/InlineChat";

const MessagesPage = () => {
  const {
    conversations,
    namesCache,
    convDisplayName,
    handleConversationClick,
    chatUser,
    setChatUser,
    auth
  } = useDashboard();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <h2 className="text-lg font-semibold mb-3">Conversations</h2>
        <div className="space-y-2">
          {conversations.length === 0 && <div className="text-sm text-muted-foreground">No conversations yet</div>}
          {conversations.map((c) => {
            return (
              <div key={c.id} className="p-3 border rounded cursor-pointer" onClick={() => handleConversationClick(c)}>
                <div className="font-semibold">{convDisplayName(c, auth.currentUser?.uid, namesCache)}</div>
                <div className="text-sm text-muted-foreground truncate">{c.lastMessage}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-3 h-[70vh]">
        {chatUser ? (
          <InlineChat otherUser={chatUser} onClose={() => setChatUser(null)} />
        ) : (
          <div className="p-6 border rounded text-muted-foreground h-full flex items-center justify-center">
            Select a conversation to view and reply.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;