
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
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

- Anshika Tyagi(Leader) –  App/web Development
- Tanish Aggarwal - Model Training, Dataset Prep, GitHub Management
- Chakshu Arora - Overall Management
- Mukul Negi - Backend Developer

---

## 📌 License

This project is under the [MIT License](LICENSE).

---

## ⭐ Star the Repo!

If you found this useful, feel free to ⭐ the repo and share it!

