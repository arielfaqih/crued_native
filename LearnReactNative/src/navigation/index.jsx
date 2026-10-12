import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PostsIndex from '../screens/posts/Index';
import PostCreate from '../screens/posts/Create';
import PostEdit from '../screens/posts/Edit';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PostsIndex">
        <Stack.Screen
          name="PostsIndex"
          component={PostsIndex}
          options={{title: 'Posts'}}
        />
        <Stack.Screen
          name="PostCreate"
          component={PostCreate}
          options={{title: 'Tambah Post'}}
        />
        <Stack.Screen
          name="PostEdit"
          component={PostEdit}
          options={{title: 'Edit Post'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
