import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import CameraScreen from './Screens/Camera';
import InfoScreen from './Screens/Info';
import ProfieScreen from './Screens/Profile';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Camera"
      tabBarPosition="bottom"
      swipeEnabled="True"
      tabBarOptions={{
        activeTintColor: '#000000',
        labelStyle: { fontSize: 12 },
        style: { backgroundColor: 'powderblue' },
        showIcon: true
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
            if (route.name === "Camera") {
              return (<FontAwesome name="camera" size={20} color="black" />)
            } else if (route.name === "Info") {
              return (<Entypo name="info-with-circle" size={20} color="black" />)
            } else if (route.name === "Profile") {
              return(<MaterialIcons name="account-circle" size={24} color="black" />)
            }
            },
          })}
    >
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{ 
          tabBarLabel: 'Info'
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ tabBarLabel: 'Camera'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfieScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
