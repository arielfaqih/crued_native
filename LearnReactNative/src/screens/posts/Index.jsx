import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import Api, {BASE_URL} from '../../services/api';

// Alert.alert does nothing on react-native-web, so the browser uses confirm()
function confirmDelete(onConfirm) {
  const message = 'Yakin ingin menghapus post ini?';

  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (window.confirm(message)) {
      onConfirm();
    }
    return;
  }

  Alert.alert('Hapus Post', message, [
    {text: 'Batal', style: 'cancel'},
    {text: 'Hapus', style: 'destructive', onPress: onConfirm},
  ]);
}

export default function PostsIndex({navigation}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const response = await Api.get('/api/posts');
      setPosts(response.data.data);
      setError('');
    } catch (e) {
      setError(`Gagal memuat data. Pastikan backend berjalan di ${BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload the list every time this screen is shown again
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

  const deletePost = id => {
    confirmDelete(async () => {
      try {
        await Api.delete(`/api/posts/${id}`);
        fetchPosts();
      } catch (e) {
        setError('Gagal menghapus post.');
      }
    });
  };

  const renderPost = ({item}) => (
    <View style={styles.card}>
      <Image
        source={{uri: `${BASE_URL}/uploads/${item.image}`}}
        style={styles.image}
      />
      <View style={styles.cardBody}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('PostEdit', {id: item.id})}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => deletePost(item.id)}>
            <Text style={styles.buttonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={posts}
      keyExtractor={item => String(item.id)}
      renderItem={renderPost}
      ListHeaderComponent={
        <>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => navigation.navigate('PostCreate')}>
            <Text style={styles.buttonText}>+ Tambah Post</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
      }
      ListEmptyComponent={
        error ? null : <Text style={styles.empty}>Belum ada post.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  list: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: 16,
  },
  loading: {
    flex: 1,
  },
  card: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  cardBody: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    marginTop: 6,
    fontSize: 15,
    color: '#4b5563',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  button: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#2563eb',
  },
  editButton: {
    backgroundColor: '#4b5563',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
    color: '#6b7280',
  },
});
