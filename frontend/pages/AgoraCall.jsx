
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";
import "./AgoraCall.css";

const BASE_URL = "https://peerlearn-4.onrender.com";

const CREATE_ROOM_URL = `${BASE_URL}/auth/agora/rooms/create/`;
const TOKEN_URL = `${BASE_URL}/auth/agora/token/`;

const authConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
    },
});

function VideoTile({ track, label, muted = false }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!track || !containerRef.current) return;

        track.play(containerRef.current);

        return () => {
            track.stop();
        };
    }, [track]);

    return (
        <div className="agora-video-tile">
            <div ref={containerRef} className="agora-video-screen" />
            <span className="agora-video-label">{label}</span>
            {muted && <span className="agora-video-muted">Mic off</span>}
        </div>
    );
}

export default function AgoraCall() {
    const clientRef = useRef(null);
    const audioTrackRef = useRef(null);
    const videoTrackRef = useRef(null);

    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const client = AgoraRTC.createClient({
            mode: "rtc",
            codec: "vp8",
        });

        clientRef.current = client;

        const updateRemoteUsers = () => {
            setRemoteUsers([...client.remoteUsers]);
        };

        const handleUserPublished = async (user, mediaType) => {
            try {
                await client.subscribe(user, mediaType);

                if (mediaType === "audio" && user.audioTrack) {
                    user.audioTrack.play();
                }

                updateRemoteUsers();
            } catch (err) {
                console.error("Could not subscribe to remote user:", err);
            }
        };

        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", updateRemoteUsers);
        client.on("user-left", updateRemoteUsers);

        return () => {
            client.removeAllListeners();

            const audio = audioTrackRef.current;
            const video = videoTrackRef.current;

            audio?.stop();
            audio?.close();

            video?.stop();
            video?.close();

            client.leave().catch(() => {});
        };
    }, []);

    const createRoom = async () => {
        setError("");
        setNotice("");
        setLoading(true);

        try {
            const response = await axios.post(
                CREATE_ROOM_URL,
                {},
                authConfig()
            );

            setRoomId(response.data.room_id);
            setNotice(
                "Room created. Share this room ID with one student, then join the room."
            );
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Could not create the room. Please sign in again if needed."
            );
        } finally {
            setLoading(false);
        }
    };

    const joinCall = async () => {
        const cleanedRoomId = roomId.trim();

        if (!cleanedRoomId) {
            setError("Enter a room ID first.");
            return;
        }

        if (cleanedRoomId.length > 64) {
            setError("The room ID is too long.");
            return;
        }

        setError("");
        setNotice("");
        setLoading(true);

        let joinedChannel = false;
        let newAudioTrack = null;
        let newVideoTrack = null;

        try {
            // Django checks the logged-in user and returns a room-specific token.
            const response = await axios.post(
                TOKEN_URL,
                { room_id: cleanedRoomId },
                authConfig()
            );

            const { app_id, channel, token, uid } = response.data;
            const client = clientRef.current;

            await client.join(app_id, channel, token, uid);
            joinedChannel = true;

            [newAudioTrack, newVideoTrack] =
                await AgoraRTC.createMicrophoneAndCameraTracks();

            audioTrackRef.current = newAudioTrack;
            videoTrackRef.current = newVideoTrack;

            setLocalAudioTrack(newAudioTrack);
            setLocalVideoTrack(newVideoTrack);

            await client.publish([newAudioTrack, newVideoTrack]);

            setRoomId(cleanedRoomId);
            setJoined(true);
            setMuted(false);
            setCameraOff(false);
            setNotice("You joined the video room.");
        } catch (err) {
            console.error("Agora join error:", err);

            newAudioTrack?.stop();
            newAudioTrack?.close();
            newVideoTrack?.stop();
            newVideoTrack?.close();

            audioTrackRef.current = null;
            videoTrackRef.current = null;
            setLocalAudioTrack(null);
            setLocalVideoTrack(null);

            if (joinedChannel) {
                await clientRef.current?.leave().catch(() => {});
            }

            setError(
                err.response?.data?.error ||
                err.message ||
                "Could not join the call. Check your room ID, permissions, and Agora configuration."
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleMicrophone = async () => {
        if (!localAudioTrack) return;

        const nextMuted = !muted;

        try {
            await localAudioTrack.setEnabled(!nextMuted);
            setMuted(nextMuted);
        } catch (err) {
            setError("Could not change microphone settings.");
        }
    };

    const toggleCamera = async () => {
        if (!localVideoTrack) return;

        const nextCameraOff = !cameraOff;

        try {
            await localVideoTrack.setEnabled(!nextCameraOff);
            setCameraOff(nextCameraOff);
        } catch (err) {
            setError("Could not change camera settings.");
        }
    };

    const leaveCall = async () => {
        setLoading(true);

        try {
            const audio = audioTrackRef.current;
            const video = videoTrackRef.current;

            if (audio) {
                audio.stop();
                audio.close();
            }

            if (video) {
                video.stop();
                video.close();
            }

            audioTrackRef.current = null;
            videoTrackRef.current = null;

            await clientRef.current?.leave();

            setLocalAudioTrack(null);
            setLocalVideoTrack(null);
            setRemoteUsers([]);
            setJoined(false);
            setMuted(false);
            setCameraOff(false);
            setNotice("You left the call.");
        } catch (err) {
            console.error("Error leaving call:", err);
            setError("There was a problem leaving the call.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="agora-page">
            <section className="agora-card">
                <h1>PeerLearn Video Call</h1>
                <p className="agora-description">
                    Create a study room or enter a room ID shared by another student.
                </p>

                {!joined && (
                    <div className="agora-room-form">
                        <button
                            type="button"
                            onClick={createRoom}
                            disabled={loading}
                            className="agora-secondary-button"
                        >
                            Create Room ID
                        </button>

                        <label htmlFor="roomId">Room ID</label>

                        <input
                            id="roomId"
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter the room ID"
                            maxLength={64}
                            autoComplete="off"
                        />

                        <button
                            type="button"
                            onClick={joinCall}
                            disabled={loading || !roomId.trim()}
                            className="agora-primary-button"
                        >
                            {loading ? "Connecting..." : "Join Video Call"}
                        </button>
                    </div>
                )}

                {error && (
                    <p className="agora-error" role="alert">
                        {error}
                    </p>
                )}

                {notice && (
                    <p className="agora-notice" role="status">
                        {notice}
                    </p>
                )}

                {roomId && (
                    <p className="agora-room-display">
                        Room ID: <strong>{roomId}</strong>
                        {!joined && (
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard?.writeText(roomId);
                                    setNotice("Copy the room ID and share it privately.");
                                }}
                            >
                                Copy ID
                            </button>
                        )}
                    </p>
                )}

                {joined && (
                    <>
                        <h2>Connected room</h2>

                        <div className="agora-video-grid">
                            <VideoTile
                                track={localVideoTrack}
                                label="You"
                                muted={muted}
                            />

                            {remoteUsers.map((user) => (
                                <VideoTile
                                    key={user.uid}
                                    track={user.videoTrack}
                                    label={`Student ${user.uid}`}
                                />
                            ))}
                        </div>

                        {remoteUsers.length === 0 && (
                            <p className="agora-waiting">
                                Waiting for the other student to join...
                            </p>
                        )}

                        <div className="agora-controls">
                            <button
                                type="button"
                                onClick={toggleMicrophone}
                                disabled={loading}
                            >
                                {muted ? "Unmute microphone" : "Mute microphone"}
                            </button>

                            <button
                                type="button"
                                onClick={toggleCamera}
                                disabled={loading}
                            >
                                {cameraOff ? "Turn camera on" : "Turn camera off"}
                            </button>

                            <button
                                type="button"
                                className="agora-leave-button"
                                onClick={leaveCall}
                                disabled={loading}
                            >
                                Leave Call
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
