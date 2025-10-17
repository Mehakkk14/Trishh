import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function uploadImage(file: File, folder: string = 'products') {
  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function deleteImage(url: string) {
  // Extract the path from the URL
  const baseUrl = storage.app.options.storageBucket;
  const path = url.split(`/${baseUrl}/`)[1].split('?')[0];
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
}
