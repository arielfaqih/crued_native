import {Platform} from 'react-native';

export async function buildPostFormData({image, title, content}) {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('content', content);

  if (image) {
    if (Platform.OS === 'web') {
      // In the browser the picker returns a data URL and the upload must be a
      // Blob. The backend checks the file extension, so the name needs one.
      const blob = await (await fetch(image.uri)).blob();
      const extension = blob.type.split('/')[1] || 'jpg';
      formData.append('image', blob, image.fileName || `image.${extension}`);
    } else {
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    }
  }

  return formData;
}
