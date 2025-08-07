
import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft, Download, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Detection {
  class: string;
  confidence: number;
  bbox: number[];
}



export default function ARVRMode() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [detectionActive, setDetectionActive] = useState(false);
  const [previousResults, setPreviousResults] = useState<Detection[][]>([]);
  const [showPrev, setShowPrev] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);

  useEffect(() => {
    checkBackendHealth();
    // Don't start camera on mount
    return () => { stopCamera(); };
    // eslint-disable-next-line
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStarted(true);
    } catch (err) {
      setError('Could not access camera.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraStarted(false);
  };

  // Start/stop camera when detectionActive changes
  useEffect(() => {
    if (detectionActive) {
      startCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line
  }, [detectionActive]);

  // Detection loop only runs if detectionActive is true and camera is started
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (backendStatus === 'online' && detectionActive && cameraStarted && !isDetecting) {
      interval = setInterval(runDetection, 1200);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [backendStatus, detectionActive, cameraStarted, isDetecting]);

  const runDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsDetecting(true);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/jpeg');
    try {
      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });
      if (!response.ok) throw new Error('Detection failed');
      const result = await response.json();
      setDetections(result.detections || []);
      setPreviousResults(prev => [[...(result.detections || [])], ...prev].slice(0, 10));
      drawDetections(result.detections || []);
    } catch (err) {
      setError('Detection failed.');
    }
    setIsDetecting(false);
  };

  const drawDetections = (detections: Detection[]) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current as HTMLVideoElement, 0, 0, canvasRef.current.width, canvasRef.current.height);
    detections.forEach(det => {
      const [x1, y1, x2, y2] = det.bbox;
      ctx.strokeStyle = det.class === 'FireExtinguisher' ? '#f87171' : det.class === 'OxygenTank' ? '#38bdf8' : '#a78bfa';
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText(`${det.class} (${det.confidence}%)`, x1 + 4, y1 + 20);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#0f172a] flex flex-col items-center justify-center p-4">
      {/* Top Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        <button
          onClick={() => { stopCamera(); navigate('/'); }}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPrev(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm border border-white/20 transition-colors"
          >
            Show Previous Results
          </button>
          <button
            onClick={() => setDetectionActive((prev) => !prev)}
            disabled={backendStatus !== 'online'}
            className={`px-4 py-2 rounded-lg text-sm border border-white/20 transition-colors ${detectionActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:bg-gray-600 disabled:cursor-not-allowed`}
          >
            {detectionActive ? 'Stop Detection' : 'Start Detection'}
          </button>
        </div>
        <div className="text-sm text-gray-300 ml-4">
          Backend: {backendStatus === 'online' ? <span className="text-green-400">Connected</span> : backendStatus === 'offline' ? <span className="text-red-400">Disconnected</span> : <span className="text-yellow-400">Checking...</span>}
        </div>
      </div>

      {/* Live Camera Preview with Canvas Overlay */}
      <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black/40 shadow-xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={960}
          height={540}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ display: cameraStarted ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          style={{ display: cameraStarted ? 'block' : 'none' }}
        />
        {!cameraStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <span className="text-white text-lg">Camera is off. Click Start Detection to begin.</span>
          </div>
        )}
        {isDetecting && detectionActive && cameraStarted && (
          <div className="absolute top-4 left-4 bg-blue-600/80 text-white px-3 py-1 rounded-lg text-xs animate-pulse z-20">
            Detecting...
          </div>
        )}
      </div>

      {/* Detection Results */}
      <div className="w-full max-w-3xl mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Live Detection Results ({detections.length})</h3>
        {detections.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No objects detected yet.</p>
            <p className="text-sm">Point your camera at a Fire Extinguisher, Tool Box, or Oxygen Tank!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {detections.map((detection, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="text-white font-semibold text-lg">{detection.class}</span>
                <span className="px-3 py-1 rounded-full text-sm border bg-black/30 text-blue-300 border-blue-400">
                  {detection.confidence}% confidence
                </span>
                <span className="text-xs text-gray-400 ml-4">[{detection.bbox.join(', ')}]</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Previous Results Modal */}
      {showPrev && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl w-full relative">
            <button
              onClick={() => setShowPrev(false)}
              className="absolute top-4 right-4 text-white bg-red-600/80 hover:bg-red-700 px-3 py-1 rounded-lg text-xs"
            >
              Close
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">Previous Detection Results</h3>
            <video
              src={"/WhatsApp Video 2025-08-06 at 20.56.01.mp4"}
              controls
              className="w-full rounded-lg mb-6 border border-white/20"
            />
            {previousResults.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No previous results yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {previousResults.map((result, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="font-semibold text-white mb-2">Result {previousResults.length - idx}</div>
                    {result.length === 0 ? (
                      <div className="text-gray-400 text-sm">No objects detected.</div>
                    ) : (
                      <ul className="text-sm text-gray-200 space-y-1">
                        {result.map((d, i) => (
                          <li key={i}>
                            <span className="font-bold text-white">{d.class}</span> - {d.confidence}% [{d.bbox.join(', ')}]
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
    </div>
  );
}