import axios from "axios";
import { MicroorganismInfo, IScannedResult } from "./types";
import { storage, db } from "./firebase";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const baseUrl = window.location.protocol.includes("https")
  ? "https://microlens-sf5r.onrender.com"
  : "http://127.0.0.1:8000";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export function removeAsterisks(text: string): string {
  return text.replace(/\*/g, "").trim();
}

export function extractPrediction(markdown: string): string | null {

  const singleLineMarkdown = markdown.replace(/\n/g, ' ');

  const patterns = [
    /\*\*Prediction:\*\*\s*\*(.*?)\*/i,
    /\*\*Organism:\*\*\s*(.*?)(?:\s+\*\*|$)/i,
    /\*\*prediction:\*\*\s*(.*?)(?:\s+\*\*|$)/i,
    /\*\*Species:\*\*\s*(.*?)(?:\s+\*\*|$)/i
  ];

  for (const pattern of patterns) {
    const match = singleLineMarkdown.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}


export const resizeImage = (
  imageDataUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageDataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
};

export const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const reportBugHelper = async (description: string) => {
  try {
    await addDoc(collection(db, "bugs"), {
      description,
      reportedAt: new Date(),
    });
    return true;
  } catch (error: any) {
    throw error;
  }
};

export const submitNewOrganismHelper = async (
  selectedImages: any[],
  organismName: string,
  organismDescription: string
) => {
  try {
    const imageUrls: string[] = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
      const storageRef = ref(storage, `organisms/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      imageUrls.push(downloadURL);
    }

    await addDoc(collection(db, "organisms"), {
      name: organismName,
      description: organismDescription,
      images: imageUrls,
      submittedAt: new Date(),
    });

    return true;
  } catch (error: any) {
    throw error;
  }
};

export const submitBugReportHelper = async (bugDescription: string) => {
  try {
    await addDoc(collection(db, "bugs"), {
      description: bugDescription,
      reportedAt: new Date(),
    });
    return true;
  } catch (error: any) {
    throw error;
  }
};

export const saveScannedRes = async (
  object: IScannedResult,
  capturedImage: string | null
) => {
  try {
    const imageFile = base64ToFile(capturedImage, `${object.prediction}.png`);
    const storageRef = ref(storage, `scannedResults/${imageFile.name}`);

    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const itemToSave = {
      ...object,
      image: downloadURL,
    };

    await addDoc(collection(db, "scannedResults"), itemToSave);
  } catch (error: any) {
    throw error;
  }
};

export const getAllSaveScanned = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "scannedResults"));
    const items: IScannedResult[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id } as IScannedResult);
    });
    return items;
  } catch (error: any) {
    throw error;
  }
};

export const deleteSavedScans = async (itemId: string) => {
  try {
    const itemDocRef = doc(db, "scannedResults", itemId);
    await deleteDoc(itemDocRef);

    const itemDoc = await getDoc(itemDocRef);

    if (itemDoc.exists()) {
      const itemData = itemDoc.data();

      const imageUrl = itemData?.image;

      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);

        await deleteObject(imageRef);
      }
    }
    const scans = await getAllSaveScanned();
    return scans;
  } catch (error: any) {
    throw error;
  }
};

export const parseError = (err: string) => {
  const regex = /Firebase: Error \((.*?)\)/;
  const match = err.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return "Unknown error";
  }
};




export function parseEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  const cleanedLocalPart = localPart.replace(/\d+/g, '');
  return cleanedLocalPart
}
