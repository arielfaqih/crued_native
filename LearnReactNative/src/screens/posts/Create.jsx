import React from 'react';

import PostForm from '../../components/PostForm';
import Api from '../../services/api';
import {buildPostFormData} from '../../utils/postFormData';

export default function PostCreate({navigation}) {
  const storePost = async values => {
    const formData = await buildPostFormData(values);
    await Api.post('/api/posts', formData);
    navigation.goBack();
  };

  return <PostForm submitLabel="Simpan" onSubmit={storePost} />;
}
