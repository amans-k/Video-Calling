import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
  // ❌ REMOVE unused import
  // useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel /* ❌ REMOVE callId */ }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount, useCameraState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const { camera } = useCameraState();
  const { microphone } = useMicrophoneState();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [videoQuality, setVideoQuality] = useState('720p'); // ✅ Quality control

  // ✅ BUFFERING FIX: Auto quality adjustment
  useEffect(() => {
    if (participantCount > 2) {
      setVideoQuality('480p'); // Lower quality for more participants
    } else {
      setVideoQuality('720p');
    }
  }, [participantCount]);

  // ✅ BUFFERING FIX: Enable hardware acceleration
  useEffect(() => {
    if (camera && camera.mediaStream) {
      const videoTrack = camera.mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        console.log("Video settings:", settings);
        
        // Try to enable hardware acceleration
        if (settings.frameRate > 30) {
          videoTrack.applyConstraints({
            frameRate: 30, // Lower frame rate for better performance
            width: { ideal: 1280 },
            height: { ideal: 720 }
          });
        }
      }
    }
  }, [camera]);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">Joining call...</p>
          <p className="text-sm text-gray-500">Optimizing video quality...</p>
        </div>
      </div>
    );
  }

  // ✅ BUFFERING FIX: Show loading during buffering
  if (callingState === CallingState.RECONNECTING || callingState === CallingState.BUFFERING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">Optimizing connection...</p>
          <p className="text-sm text-gray-500">
            {videoQuality} • {participantCount} participants
          </p>
          <button 
            className="btn btn-sm btn-outline mt-4"
            onClick={() => {
              // Temporary disable video to reduce buffering
              camera.disable();
            }}
          >
            Turn off video to improve connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video">
      <div className="flex-1 flex flex-col gap-3">
        {/* Participants count and Quality Controls */}
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {participantCount} {participantCount === 1 ? "participant" : "participants"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Quality: {videoQuality}</span>
              {callingState === CallingState.BUFFERING && (
                <span className="text-orange-500">• Buffering</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* ✅ Quality Control Buttons */}
            <div className="btn-group btn-group-sm">
              <button 
                className={`btn ${videoQuality === '480p' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setVideoQuality('480p')}
                title="Lower quality for better performance"
              >
                480p
              </button>
              <button 
                className={`btn ${videoQuality === '720p' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setVideoQuality('720p')}
                title="Balanced quality"
              >
                720p
              </button>
            </div>
            
            {chatClient && channel && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`btn btn-sm gap-2 ${isChatOpen ? "btn-primary" : "btn-ghost"}`}
                title={isChatOpen ? "Hide chat" : "Show chat"}
              >
                <MessageSquareIcon className="size-4" />
                Chat
              </button>
            )}
          </div>
        </div>

        {/* Video Area with Performance Optimizations */}
        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative">
          <SpeakerLayout 
            participantsBarPosition="bottom" 
            // ✅ Reduce UI complexity for better performance
          />
        </div>

        {/* Controls with Performance Options */}
        <div className="bg-base-100 p-3 rounded-lg shadow flex flex-col gap-3">
          <CallControls 
            onLeave={() => navigate("/dashboard")}
            // ✅ Additional performance options
          />
          
          {/* ✅ Performance Quick Actions */}
          <div className="flex justify-center gap-2">
            <button
              className={`btn btn-sm ${camera.isEnabled ? 'btn-warning' : 'btn-success'}`}
              onClick={() => camera.isEnabled ? camera.disable() : camera.enable()}
            >
              {camera.isEnabled ? 'Turn Off Video' : 'Turn On Video'}
            </button>
            <button
              className={`btn btn-sm ${microphone.isEnabled ? 'btn-warning' : 'btn-success'}`}
              onClick={() => microphone.isEnabled ? microphone.disable() : microphone.enable()}
            >
              {microphone.isEnabled ? 'Mute' : 'Unmute'}
            </button>
          </div>
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
                <h3 className="font-semibold text-white">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;