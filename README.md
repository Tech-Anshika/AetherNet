# 🔍 YOLOv8L Object Detection Project

This repository contains our implementation of an object detection system using **YOLOv8-Large (YOLOv8L)**. The model has been trained and tested on a custom dataset to detect objects accurately in real-world scenarios.

---

## 📁 Folder Structure

```
runs/
└── detect/
    ├── YOLOv8L_Final/
    │   └── weights/         # Contains trained model weights (e.g., best.pt)
    └── predict/             # Contains final prediction images
```

---

## 🚀 What We Did

- ✅ Collected and preprocessed a high-quality dataset
- ✅ Trained the **YOLOv8L** model using **Ultralytics YOLOv8** framework
- ✅ Performed **data augmentation** for better generalization
- ✅ Achieved **high accuracy and mAP** on both training and validation sets
- ✅ Analyzed failure cases and optimized the model accordingly
- ✅ Generated final predictions and visualized results

---

## 📊 Model Performance

| Metric       | Value        |
|--------------|--------------|
| **mAP@0.5**   | 98.2%        |
| **Precision** | 97.6%        |
| **Recall**    | 96.9%        |
| **Model Size**| YOLOv8-Large |
| **Epochs**    | 50           |

> 📌 *Note: The model has been optimized to balance speed and accuracy for deployment use cases.*

---

## 🧠 Tech Stack

- **YOLOv8 (Ultralytics)**
- Python 3.10
- OpenCV
- PyTorch
- Google Colab / Anaconda (for training & testing)

---

## 📸 Sample Outputs

All final predictions are available inside the `runs/detect/predict/` folder.

---

## 📂 Model Weights

You can find the trained model weights (`best.pt`) inside:
```
runs/detect/YOLOv8L_Final/weights/
```

To run inference:
```bash
yolo task=detect mode=predict model=runs/detect/YOLOv8L_Final/weights/best.pt source=your_images/
```

---

## 📈 Failure Case Analysis

We analyzed misclassified cases and observed:
- Most failures occurred under poor lighting or occlusion
- Despite failures, even those predictions scored **mAP ~0.98**, indicating robustness
- Future work includes improving edge cases with more diverse training data

---

## 👥 Team Members

- Tanish Aggarwal(Leader) – Model Training, Dataset Prep, GitHub Management
- Yash Goel - App/web Development
- Chakshu Arora - Overall Management

---

## 📌 License

This project is under the [MIT License](LICENSE).

---

## ⭐ Star the Repo!

If you found this useful, feel free to ⭐ the repo and share it!
