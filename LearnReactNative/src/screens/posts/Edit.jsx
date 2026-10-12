import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';

import PostForm from '../../components/PostForm';
import Api, {BASE_URL} from '../../services/api';
import {buildPostFormData} from '../../utils/postFormData';

export default function PostEdit({navigation, route}) {
  const {id} = route.params;
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Api.get(`/api/posts/${id}`)
      .then(response => {
        if (response.data.data) {
          setPost(response.data.data);
        } else {
          setError('Post tidak ditemukan.');
        }
      })
      .catch(() => setError('Gagal memuat post.'));
  }, [id]);

  const updatePost = async values => {
    const formData = await buildPostFormData(values);
    await Api.put(`/api/posts/${id}`, formData);
    navigation.goBack();
  };

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!post) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  return (
    <PostForm
      initialValues={post}
      imageUrl={`${BASE_URL}/uploads/${post.image}`}
      submitLabel="Update"
      onSubmit={updatePost}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
  },
  error: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
});
