import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardNavbar } from "../components/DashboardNavbar"; // Adjust path if needed
import { DashboardFooter } from "../components/DashboardFooter"; // Adjust path if needed
import { auth, db } from "../components/firebase"; // Adjust path if needed
import Messenger from "../components/Messenger"; // Adjust path if needed
import {
  collection, query, doc, setDoc, orderBy, onSnapshot,
  updateDoc, deleteDoc, getDoc, where,
} from "firebase/firestore";
import Toasts from "../components/Toast"; // Adjust path if needed
import ConfirmModal from "../components/ConfirmModal"; // Adjust path if needed
import { DashboardContext } from "./Dashboard/DashboardContext"; 

// --- Component ---

export const Dashboard = () => {
  // --- State Declarations (Most stay here) ---
  const [myProfile, setMyProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [connections, setConnections] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toCancel, setToCancel] = useState(null);
  const [namesCache, setNamesCache] = useState({});
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);

  const location = useLocation(); 

  // --- Utility Functions (Stay here) ---
  const convDisplayName = (c, meUid, cache = {}) => {
    if (!c) return "Conversation";
    if (c.title) return c.title;
    if (c.participants && meUid) {
      const other = c.participants.find((p) => p !== meUid);
      if (other && cache[other]) {
        return cache[other];
      }
      return other || c.id;
    }
    return c.id;
  };

  // --- Data Loading Effects (All stay here) ---
  // Real-time profiles list
  useEffect(() => {
    const usersCol = collection(db, "users");
    const q = query(usersCol, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => {
        const data = d.data();
        if (auth.currentUser && data.uid === auth.currentUser.uid) return;
        list.push({
          uid: data.uid,
          name: data.name,
          email: data.email,
          university: data.university,
          expertise: data.expertise,
        });
      });
      setProfiles(list);
      setIsLoadingProfiles(false);
    });
    return () => unsub();
  }, []);

  // Real-time listeners for my data
  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    // Load current user's profile
    const loadMyProfile = async () => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setMyProfile(snap.data());
      }
    };
    loadMyProfile();

    // Listener for my connections
    const connRef = collection(db, "users", uid, "connections");
    const unsubConn = onSnapshot(connRef, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      setConnections(list);
      setIsLoadingConnections(false);
    });

    // Listener for my incoming invitations
    const invRef = collection(db, "users", uid, "invitations");
    const unsubInv = onSnapshot(invRef, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      const pending = list.filter((i) => i.status === "pending");
      setInvitations((prev) => {
        const prevIds = new Set(prev.map((p) => p.uid));
        const newOnes = pending.filter((p) => !prevIds.has(p.uid));
        if (newOnes.length > 0) {
          newOnes.forEach((n) => {
            setToasts((t) => [...t, { id: `${Date.now()}-${n.uid}`, message: `New invitation from ${n.name}` }]);
          });
        }
        return pending;
      });
    });

    // Listener for my outgoing requests
    const reqRef = collection(db, "users", uid, "requests");
    const unsubReq = onSnapshot(reqRef, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      setRequests(list);
    });

    // Listener for conversations
    const convRef = collection(db, "conversations");
    const convQ = query(convRef, where("participants", "array-contains", uid), orderBy("updatedAt", "desc"));
    
    // --- THIS IS THE FIX ---
    // Changed onSQLSnapshot to onSnapshot
    const unsubConv = onSnapshot(convQ, (snap) => { 
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setConversations(list);

      // Preload participant display names into cache
      list.forEach((c) => {
        const parts = c.participants || [];
        parts.forEach(async (p) => {
          if (p === auth.currentUser?.uid) return;
          setNamesCache((prev) => {
            if (prev[p]) return prev; 
            getDoc(doc(db, 'users', p)).then(snapU => {
              if (snapU.exists()) {
                const data = snapU.data();
                setNamesCache((prevCache) => ({ ...prevCache, [p]: data.name || p }));
              } else {
                setNamesCache((prevCache) => ({ ...prevCache, [p]: p })); 
              }
            }).catch(() => {
              setNamesCache((prevCache) => ({ ...prevCache, [p]: p })); 
            });
            return prev; 
          });
        });
      });
    });

    return () => {
      unsubConn();
      unsubInv();
      unsubReq();
      unsubConv();
    };
  }, [auth.currentUser]);


  // --- Action Handlers (Most stay here) ---

  const handleConnect = async (profile) => {
    if (!auth.currentUser || !myProfile) {
      return setToasts((t) => [...t, { id: `${Date.now()}`, message: "You must be signed in to connect." }]);
    }
    try {
      const me = auth.currentUser;
      await setDoc(doc(db, "users", profile.uid, "invitations", me.uid), {
        uid: me.uid,
        name: myProfile.name || me.displayName || "",
        email: myProfile.email || me.email || "",
        university: myProfile.university || "",
        expertise: myProfile.expertise || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      await setDoc(doc(db, "users", me.uid, "requests", profile.uid), {
        uid: profile.uid,
        name: profile.name || "",
        email: profile.email || "",
        university: profile.university || "",
        expertise: profile.expertise || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setToasts((t) => [...t, { id: `${Date.now()}`, message: `Connection request sent to ${profile.name}` }]);
    } catch (err) {
      console.error("Connect failed:", err);
      setToasts((t) => [...t, { id: `${Date.now()}`, message: "Error: Failed to send request." }]);
    }
  };

  const acceptInvitation = async (inv) => {
    if (!auth.currentUser || !myProfile) return;
    const me = auth.currentUser;
    try {
      // Create connection in MY collection (with THEIR info)
      await setDoc(doc(db, "users", me.uid, "connections", inv.uid), {
        uid: inv.uid,
        name: inv.name || "",
        email: inv.email || "",
        university: inv.university || "",
        expertise: inv.expertise || "",
        status: "accepted",
        connectedAt: new Date().toISOString(),
      });

      // Create connection in THEIR collection (with MY info)
      await setDoc(doc(db, "users", inv.uid, "connections", me.uid), {
        uid: me.uid,
        name: myProfile.name || me.displayName || "",
        email: myProfile.email || me.email || "",
        university: myProfile.university || "", 
        expertise: myProfile.expertise || "", 
        status: "accepted",
        connectedAt: new Date().toISOString(),
      });

      // Update invitation (in MY collection)
      await updateDoc(doc(db, "users", me.uid, "invitations", inv.uid), {
        status: "accepted",
        respondedAt: new Date().toISOString(),
      });

      // Update request (in THEIR collection)
      await updateDoc(doc(db, "users", inv.uid, "requests", me.uid), {
        status: "accepted",
        respondedAt: new Date().toISOString(),
      });
      setToasts((t) => [...t, { id: `${Date.now()}`, message: `You are now connected with ${inv.name}` }]);
    } catch (err) {
      console.error("Accept failed:", err);
      setToasts((t) => [...t, { id: `${Date.now()}`, message: "Error: Failed to accept invitation." }]);
    }
  };

  const denyInvitation = async (inv) => {
    if (!auth.currentUser) return;
    const me = auth.currentUser;
    try {
      await updateDoc(doc(db, "users", me.uid, "invitations", inv.uid), {
        status: "denied",
        respondedAt: new Date().toISOString(),
      });

      await updateDoc(doc(db, "users", inv.uid, "requests", me.uid), {
        status: "denied",
        respondedAt: new Date().toISOString(),
      });
      setToasts((t) => [...t, { id: `${Date.now()}`, message: `Declined invitation from ${inv.name}` }]);
    } catch (err) {
      console.error("Deny failed:", err);
      setToasts((t) => [...t, { id: `${Date.now()}`, message: "Error: Failed to deny invitation." }]);
    }
  };

  const cancelOutgoingRequest = async (r) => {
    if (!auth.currentUser || !r) return;
    const me = auth.currentUser;
    try {
      await deleteDoc(doc(db, "users", me.uid, "requests", r.uid));
      await deleteDoc(doc(db, "users", r.uid, "invitations", me.uid));
      
      setRequests((prev) => prev.filter((x) => x.uid !== r.uid));
      setToasts((t) => [...t, { id: `${Date.now()}-cancel-${r.uid}`, message: `Cancelled request to ${r.name}` }]);
      setToCancel(null);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Cancel failed:", err);
      setToasts((t) => [...t, { id: `${Date.now()}`, message: "Error: Failed to cancel request." }]);
    }
  };

  const handleConversationClick = async (c) => {
    if (!auth.currentUser?.uid) return;
    const otherUid = c.participants.find((p) => p !== auth.currentUser.uid);
    if (!otherUid) return;
    
    try {
      const docRef = doc(db, "users", otherUid);
      const snap = await getDoc(docRef);
      const data = snap.exists() ? snap.data() : { uid: otherUid, name: otherUid };
      setChatUser({ uid: otherUid, name: data.name || otherUid, university: data.university, expertise: data.expertise });
    } catch (err) {
      console.error("Failed to get user for chat:", err);
      setChatUser({ uid: otherUid, name: otherUid });
    }
  };

  // --- Context Provider Value ---
  const providerValue = {
    myProfile,
    setMyProfile,
    profiles,
    connections,
    invitations,
    requests,
    conversations,
    chatUser,
    setChatUser,
    toasts,
    setToasts,
    namesCache,
    isLoadingProfiles,
    isLoadingConnections,
    auth,
    db,
    convDisplayName,
    handleConnect,
    acceptInvitation,
    denyInvitation,
    cancelOutgoingRequest,
    handleConversationClick,
    setConfirmOpen,
    setToCancel,
  };

  // --- Render ---
  const isMessagesTab = location.pathname.includes("/dashboard/messages");

  return (
    <DashboardContext.Provider value={providerValue}>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardNavbar />
        <main className="container py-6">
          <div className="mt-4">
            <section className="mt-2">
              <Outlet />
            </section>
          </div>
        </main>

        <Toasts
          toasts={toasts}
          onClose={(id) => setToasts((t) => t.filter((x) => x.id !== id))}
        />

        <ConfirmModal
          open={confirmOpen}
          title="Cancel request"
          description={`Are you sure you want to cancel the request to ${toCancel?.name || "this user"}?`}
          onClose={() => { setConfirmOpen(false); setToCancel(null); }}
          onConfirm={() => cancelOutgoingRequest(toCancel)}
        />

        <DashboardFooter />
        
        {chatUser && !isMessagesTab ? (
          <Messenger otherUser={chatUser} onClose={() => setChatUser(null)} />
        ) : null}
      </div>
    </DashboardContext.Provider>
  );
};

export default Dashboard;