import React, { useState, useContext, createContext } from 'react';
import { useDashboard } from './DashboardContext';

// We STILL import the other shadcn components you're using.
// The custom code is just for the TABS.
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Check,
  X,
  UserMinus,
  MessageSquare,
  Loader2,
} from "lucide-react";

// --- START: CUSTOM TABS COMPONENTS ---
// We'll build our own Tabs system from scratch here.
// This code is reusable for any part of your app.

// 1. Create a Context to hold the active tab state
const TabsContext = createContext();

// 2. A helper function for conditional classnames (like shadcn's 'cn')
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// 3. The main <Tabs> parent component
// It holds the state and provides it to all children
const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// 4. The <TabsList> component
// This styles the container for the tab buttons
const TabsList = ({ children, className }) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
};

// 5. The <TabsTrigger> component
// This is the clickable button that changes the active tab
const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "hover:text-foreground/80",
        className
      )}
    >
      {children}
    </button>
  );
};

// 6. The <TabsContent> component
// This panel only shows its content if its 'value' matches the active tab
const TabsContent = ({ value, children, className }) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return isActive ? (
    <div
      className={cn(
        "mt-4 ring-offset-background", // Added margin-top for spacing
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  ) : null;
};
// --- END: CUSTOM TABS COMPONENTS ---

//
// --- YOUR CONNECTIONS PAGE ---
// Now we use our new custom components.
//
const ConnectionsPage = () => {
  const {
    isLoadingConnections,
    invitations,
    requests,
    connections,
    acceptInvitation,
    denyInvitation,
    setConfirmOpen,
    setToCancel,
    setChatUser
  } = useDashboard();

  if (isLoadingConnections) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
        <p className="ml-3 text-muted-foreground">Loading connections...</p>
      </div>
    );
  }

  return (
    // Use our custom <Tabs> component
    <Tabs defaultValue="invitations" className="w-full space-y-4">
      
      {/* Use our custom <TabsList> with the grid layout */}
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="invitations">
          Incoming ({invitations.length})
        </TabsTrigger>
        <TabsTrigger value="requests">
          Outgoing ({requests.length})
        </TabsTrigger>
        <TabsTrigger value="connections">
          Connections ({connections.length})
        </TabsTrigger>
      </TabsList>

      {/* --- TAB 1: INCOMING CONTENT --- */}
      <TabsContent value="invitations">
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            No new invitations.
          </p>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => (
              <div 
                key={inv.uid} 
                className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{inv.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{inv.name}</div>
                    <div className="text-sm text-muted-foreground">{inv.university}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" onClick={() => acceptInvitation(inv)}>
                    <Check className="mr-2 h-4 w-4" /> Accept
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => denyInvitation(inv)}>
                    <X className="mr-2 h-4 w-4" /> Deny
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* --- TAB 2: OUTGOING CONTENT --- */}
      <TabsContent value="requests">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            No pending requests.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div 
                key={r.uid} 
                className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{r.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-muted-foreground">{r.university}</div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => { setToCancel(r); setConfirmOpen(true); }}
                  >
                    <UserMinus className="mr-2 h-4 w-4" /> Cancel Request
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* --- TAB 3: CONNECTIONS CONTENT --- */}
      <TabsContent value="connections">
        {connections.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            You haven't made any connections yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((c) => (
              <Card key={c.uid} className="flex flex-col">
                <CardContent className="p-4 flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-sm text-muted-foreground">{c.university}</p>
                    </div>
                  </div>
                  <p className="text-sm">{c.expertise}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={() => setChatUser(c)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

    </Tabs>
  );
};

export default ConnectionsPage;