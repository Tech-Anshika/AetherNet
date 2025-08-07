console.log('🔥 ObjectDetection loaded hai bhai!', new Date().toISOString());
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';

interface Detection {
  class: string;
  confidence: number;
  bbox: number[];
}

interface DetectionResult {
  success: boolean;
  detections: Detection[];
  count: number;
  error?: string;
}

const ObjectDetection = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus('offline');
    }
  };

  // Real API call to your Flask backend
  const detectObjects = async (imageData: string): Promise<DetectionResult> => {
    try {
      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Detection API call failed:', error);
      return { 
        success: false, 
        detections: [], 
        count: 0, 
        error: error.message 
      };
    }
  };

  // Handle file upload and detection
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (backendStatus !== 'online') {
      alert('Backend is not running! Make sure your Flask server is started.');
      return;
    }

    setIsDetecting(true);
    setDetections([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setCurrentImage(imageData);

      console.log('Sending image to backend for detection...');
      const result = await detectObjects(imageData);
      
      if (result.success) {
        console.log('Detection successful:', result);
        setDetections(result.detections);
      } else {
        console.error('Detection failed:', result.error);
        alert(`Detection failed: ${result.error || 'Unknown error'}`);
      }
      
      setIsDetecting(false);
    };
    
    reader.readAsDataURL(file);
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      image: currentImage,
      detections: detections,
      summary: {
        total_objects: detections.length,
        fire_extinguishers: detections.filter(d => d.class === 'FireExtinguisher').length,
        oxygen_tanks: detections.filter(d => d.class === 'OxygenTank').length,
        toolboxes: detections.filter(d => d.class === 'ToolBox').length,
      }
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detection-results-${Date.now()}.json`;
    a.click();
  };

  const getStatusColor = (confidence: number) => {
    if (confidence > 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (confidence > 50) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'offline': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#0f172a] p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Backend Status */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {getStatusIcon()}
            <span className={`text-sm ${
              backendStatus === 'online' ? 'text-green-400' : 
              backendStatus === 'offline' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              Backend: {backendStatus === 'online' ? 'Connected' : backendStatus === 'offline' ? 'Disconnected' : 'Checking...'}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            🚀 Detect-X Object Detection
          </h1>
          <p className="text-gray-300">AI-powered spacecraft safety equipment detection using YOLOv8</p>
          
          {backendStatus === 'offline' && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300">⚠️ Backend server is not running. Start your Flask server with: <code className="bg-black/30 px-2 py-1 rounded">python app.py</code></p>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col items-center space-y-4">
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isDetecting || backendStatus !== 'online'}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>{isDetecting ? 'AI is analyzing...' : 'Upload Image for Detection'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {isDetecting && (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span>Running YOLOv8 detection on your image...</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Image Display */}
          {currentImage && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Input Image</h3>
              <img 
                src={currentImage} 
                alt="Detection input" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Detection Results */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                AI Detection Results ({detections.length})
              </h3>
              {detections.length > 0 && (
                <button 
                  onClick={exportResults} 
                  className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              )}
            </div>
            
            {detections.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No objects detected yet.</p>
                <p className="text-sm">Upload an image to run AI detection!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {detections.map((detection, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold text-lg">
                        {detection.class}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(detection.confidence)}`}>
                        {detection.confidence}% confidence
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Position: [{detection.bbox.join(', ')}]
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        {detections.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">🎯 Detection Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {detections.length}
                </div>
                <div className="text-sm text-gray-300">Total Objects</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {detections.filter(d => d.class === 'FireExtinguisher').length}
                </div>
                <div className="text-sm text-green-300">Fire Extinguishers</div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {detections.filter(d => d.class === 'OxygenTank').length}
                </div>
                <div className="text-sm text-blue-300">Oxygen Tanks</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {detections.filter(d => d.class === 'ToolBox').length}
                </div>
                <div className="text-sm text-purple-300">Tool Boxes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectDetection;
