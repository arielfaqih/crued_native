import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

function getErrors(error) {
  const response = error.response;

  if (!response) {
    return {general: 'Tidak bisa terhubung ke server.'};
  }

  // Validation errors from the backend: [{path: 'title', msg: '...'}]
  if (response.status === 422) {
    const errors = {};
    response.data.errors.forEach(item => {
      errors[item.path] = item.msg;
    });
    return errors;
  }

  return {
    general:
      'Gagal menyimpan post. Pastikan gambar berformat jpg, png, gif, atau webp dan ukurannya maksimal 5 MB.',
  };
}

export default function PostForm({
  initialValues,
  imageUrl,
  submitLabel,
  onSubmit,
}) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const previewUri = image?.uri ?? imageUrl;

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.assets?.length) {
      setImage(result.assets[0]);
    }
  };

  const submit = async () => {
    setSaving(true);
    setErrors({});

    try {
      await onSubmit({image, title, content});
    } catch (error) {
      setErrors(getErrors(error));
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      {errors.general ? (
        <Text style={styles.alert}>{errors.general}</Text>
      ) : null}

      <Text style={styles.label}>Gambar</Text>
      {previewUri ? (
        <Image source={{uri: previewUri}} style={styles.preview} />
      ) : null}
      <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
        <Text style={styles.pickButtonText}>
          {previewUri ? 'Ganti Gambar' : 'Pilih Gambar'}
        </Text>
      </TouchableOpacity>
      {errors.image ? <Text style={styles.error}>{errors.image}</Text> : null}

      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Masukkan judul"
      />
      {errors.title ? <Text style={styles.error}>{errors.title}</Text> : null}

      <Text style={styles.label}>Konten</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={content}
        onChangeText={setContent}
        placeholder="Masukkan konten"
        multiline
      />
      {errors.content ? (
        <Text style={styles.error}>{errors.content}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={submit}
        disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  form: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  preview: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  pickButton: {
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pickButtonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: 4,
    color: '#dc2626',
  },
  alert: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  submitButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
