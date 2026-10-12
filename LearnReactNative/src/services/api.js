import axios from 'axios';
import {Platform} from 'react-native';

// The Android emulator reaches the computer through 10.0.2.2, the browser
// uses localhost
export const BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const Api = axios.create({
  baseURL: BASE_URL,
});

export default Api;
