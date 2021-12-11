/**
 * @format
 * @flow strict-local
 */
import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import Search from './src/screens/Search'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false, animationEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;