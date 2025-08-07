from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import numpy as np
from ultralytics import YOLO
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow React to call this API

# Load your model (UPDATE THIS PATH!)
model = YOLO(r'C:\Users\chaks\Downloads\best.pt')
class_names = {0: 'FireExtinguisher', 1: 'ToolBox', 2: 'OxygenTank'}

@app.route('/detect', methods=['POST'])
def detect():
    try:
        # Get image from frontend
        data = request.get_json()
        image_data = data['image'].split(',')[1]  # Remove data:image/jpeg;base64,
        
        # Convert to PIL Image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        
        # Run YOLO detection
        results = model(image_np, conf=0.3)
        
        # Extract detections
        detections = []
        for r in results:
            if r.boxes is not None:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    conf = float(box.conf[0])
                    cls = int(box.cls[0])
                    
                    detections.append({
                        'class': class_names.get(cls, 'Unknown'),
                        'confidence': round(conf * 100, 1),
                        'bbox': [int(x1), int(y1), int(x2), int(y2)]
                    })
        
        return jsonify({
            'success': True,
            'detections': detections,
            'count': len(detections)
        })
        
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'model_loaded': True})

if __name__ == '__main__':
    logger.info("Starting server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
