import {
  useVoiceAssistant,
  BarVisualizer,
  useTrackTranscription,
  useLocalParticipant,
  DisconnectButton,
  useRoomContext,
  useDataChannel,
} from "@livekit/components-react";
import { Track, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import { useTracks, VideoTrack } from '@livekit/components-react';
import { useNavigate } from "react-router-dom";
import "./AvatarVoiceAgent.css";

const Message = ({ type, text }) => {
  return <div className="message">
    <strong className={`message-${type}`}>
      {type === "agent" ? "Agent: " : "You: "}
    </strong>
    <span className="message-text">{text}</span>
  </div>;
};

const AvatarVoiceAgent = ({ onDisconnect }) => {
  const navigate = useNavigate();
  const room = useRoomContext();
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();

  // Listen to LiveKit navigation data packets from backend agent tool (open_browser)
  useEffect(() => {
    if (!room) return;
    const handleDataReceived = (payload, participant, kind, topic) => {
      try {
        const decoded = new TextDecoder().decode(payload);
        const data = JSON.parse(decoded);
        console.log("[ai-avatar] Received room data packet:", data, "topic:", topic);
        if (data && data.action === "disconnect") {
          console.log("[ai-avatar] Disconnect action received from agent, scheduling room disconnect in 3.5s...");
          setTimeout(() => {
            if (room) room.disconnect();
          }, 3500);
          return;
        }
        if (data && (data.action === "navigate" || data.url)) {
          let path = data.url;
          if (path.startsWith("http://") || path.startsWith("https://")) {
            const parsed = new URL(path);
            path = parsed.pathname + parsed.search;
          }
          // Normalize alias routes hallucinated by LLM & map pricing to /#rooms
          const rawPath = path.split("?")[0];
          const queryStr = path.includes("?") ? "?" + path.split("?").slice(1).join("?") : "";
          const lowerPath = rawPath.toLowerCase();
          const ROUTE_ALIASES = {
            "/room-types": "/#rooms",
            "/rooms": "/#rooms",
            "/room": "/#rooms",
            "/pricing": "/#rooms",
            "/price": "/#rooms",
            "/harga": "/#rooms",
            "/kamar": "/#rooms",
            "/gym": "/fitness-center",
            "/fitness": "/fitness-center",
            "/spa": "/spa-wellness",
            "/wellness": "/spa-wellness",
            "/valet": "/valet-parking",
            "/parking": "/valet-parking",
            "/home": "/",
            "/confirmation": "/bookingconfirmation",
            "/confirm": "/bookingconfirmation",
          };
          if (ROUTE_ALIASES[lowerPath]) {
            path = ROUTE_ALIASES[lowerPath] + queryStr;
          }

          console.log("[ai-avatar] Navigating React router to:", path);
          if (path.includes("#")) {
            const [pathname, hash] = path.split("#");
            const targetPath = pathname || "/";
            navigate(targetPath + queryStr);
            setTimeout(() => {
              // Trigger header navbar link click for proper navigation
              const navBtn = document.getElementById(`nav-btn-${hash}`) ||
                             Array.from(document.querySelectorAll('nav button')).find(b => b.innerText && b.innerText.toLowerCase().includes(hash));
              if (navBtn) {
                console.log("[ai-avatar] Clicking header navbar link:", navBtn);
                navBtn.click();
              } else {
                const element = document.getElementById(hash);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }
            }, 200);
          } else {
            navigate(path);
          }
        }
      } catch (err) {
        console.error("[ai-avatar] Error processing navigation data packet:", err);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, navigate]);

  // Secondary topic-filtered DataChannel hook listener
  useDataChannel("navigation", (data) => {
    try {
      const decoded = new TextDecoder().decode(data.payload);
      const payload = JSON.parse(decoded);
      console.log("[ai-avatar] DataChannel navigation packet received:", payload);
      if (payload && payload.url) {
        let path = payload.url;
        if (path.startsWith("http://") || path.startsWith("https://")) {
          const parsed = new URL(path);
          path = parsed.pathname + parsed.search;
        }
        console.log("[ai-avatar] Navigating React router to:", path);
        navigate(path);
      }
    } catch (e) {
      console.error("[ai-avatar] Error in useDataChannel navigation:", e);
    }
  });
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });
  const trackRefs = useTracks([Track.Source.Camera]);
  // Fix Monarch: aslinya `trackRef.participant.name = 'admin'` (assignment, bukan comparison)
  // -> cari participant yg publish camera (avatar Tavus = tavus-avatar-agent)
  const localCamTrackRef = trackRefs.find((trackRef) => trackRef.participant.name === 'tavus-avatar-agent') ?? trackRefs.find((t) => t.participant.isAgent);

  const [messages, setMessages] = useState([]);
  const [micError, setMicError] = useState(null);

  // Fix Monarch: clear localStorage device choices stale (lk-user-choices)
  // Biar mic pakai default device, bukan device ID lama yang udah gak ada
  // (gejala: NotFoundError: Requested device not found pas klik mic)
  const [micReady, setMicReady] = useState(false);
  useEffect(() => {
    try {
      const KEYS = ["lk-user-choices", "lk-components-js-user-choices"];
      for (const k of KEYS) {
        try { localStorage.removeItem(k); } catch {}
      }
      console.log("[ai-avatar] device choices cleared");
    } catch {}
  }, []);

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  const stateLabel = {
    disconnected: "Ready — press mic to talk",
    connecting: "Connecting to agent...",
    connected: "Agent connected",
    listening: "🎤 Listening...",
    thinking: "🤔 Thinking...",
    speaking: "🔊 Sarah is speaking...",
  };

  // Auto-enable microphone on room connect
  useEffect(() => {
    const enableMicOnJoin = async () => {
      try {
        const lp = localParticipant.localParticipant;
        if (lp && !lp.isMicrophoneEnabled) {
          await lp.setMicrophoneEnabled(true, {
            captureOptions: { audio: { echoCancellation: true, noiseSuppression: true } },
          });
          console.log("[ai-avatar] mic automatically enabled on room join");
        }
      } catch (e) {
        console.error("[ai-avatar] auto enable mic error:", e);
      }
    };
    enableMicOnJoin();
  }, [localParticipant.localParticipant]);

  return (
    <div className="voice-assistant-container">
      <div className="visualizer-container">
        <BarVisualizer state={state} barCount={5} trackRef={audioTrack} />
      </div>
      <>
      {localCamTrackRef ? <VideoTrack trackRef={localCamTrackRef} /> : <div style={{fontSize:'0.85rem', color:'#777', padding:'20px 0', textAlign:'center'}}>Connecting AI Avatar...</div>}
      </>

      {/* Status indicator */}
      <div className="agent-state" style={{fontSize:'0.85rem', color:'#888', marginTop:8}}>
        {stateLabel[state] || state}
      </div>

      {/* Device error */}
      {micError && (
        <div className="mic-error" style={{color:'#e74c3c', fontSize:'0.8rem', marginTop:4}}>
          ⚠️ {micError}
        </div>
      )}

      {/* Disconnect Only Section */}
      <div className="control-section" style={{display:'flex', justifyContent:'center', marginTop:10}}>
        <DisconnectButton onClick={onDisconnect}>Disconnect</DisconnectButton>
      </div>
    </div>
  );
};

export default AvatarVoiceAgent;
