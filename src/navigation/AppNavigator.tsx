import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ModeSelectionScreen from '../screens/ModeSelectionScreen';
import DeviceTypeScreen from '../screens/DeviceTypeScreen';
import DeviceSubtypeScreen from '../screens/DeviceSubtypeScreen';
import DeviceListScreen from '../screens/DeviceListScreen';
import CommutatorListScreen from '../screens/CommutatorListScreen';
import PortListScreen from '../screens/PortListScreen';
import ConfigurationConfirmScreen from '../screens/ConfigurationConfirmScreen';
import DiagnosticMainScreen from '../screens/diagnostic/DiagnosticMainScreen';
import MainScreen from '../screens/diagnostic/MainScreen';
import KeysScreen from '../screens/diagnostic/KeysScreen';
import ApartmentsScreen from '../screens/diagnostic/ApartmentsScreen';
import MatrixScreen from '../screens/diagnostic/MatrixScreen';
import EntranceScreen from '../screens/diagnostic/EntranceScreen';
import RunningLineScreen from '../screens/diagnostic/RunningLineScreen';
import SoundScreen from '../screens/diagnostic/SoundScreen';
import EqualizerScreen from '../screens/diagnostic/EqualizerScreen';
import SipAccountScreen from '../screens/diagnostic/SipAccountScreen';
import VideoStreamScreen from '../screens/diagnostic/VideoStreamScreen';
import DDNSScreen from '../screens/diagnostic/DDNSScreen';
import NetworkSettingsScreen from '../screens/diagnostic/NetworkSettingsScreen';
import SyslogScreen from '../screens/diagnostic/SyslogScreen';
import UpdateScreen from '../screens/diagnostic/UpdateScreen';
import DateTimeScreen from '../screens/diagnostic/DateTimeScreen';
import RebootScreen from '../screens/diagnostic/RebootScreen';
import ResetScreen from '../screens/diagnostic/ResetScreen';

export type RootStackParamList = {
  ModeSelection: undefined;
  DeviceType: undefined;
  DeviceSubtype: undefined;
  DeviceList: undefined;
  CommutatorList: undefined;
  PortList: undefined;
  ConfigurationConfirm: undefined;
  DiagnosticMain: undefined;
  Main: undefined;
  Keys: undefined;
  Apartments: undefined;
  Matrix: undefined;
  Entrance: undefined;
  RunningLine: undefined;
  Sound: undefined;
  Equalizer: undefined;
  SipAccount: undefined;
  VideoStream: undefined;
  DDNS: undefined;
  NetworkSettings: undefined;
  Syslog: undefined;
  Update: undefined;
  DateTime: undefined;
  Reboot: undefined;
  Reset: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DiagnosticMain"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        <Stack.Screen name="DeviceType" component={DeviceTypeScreen} />
        <Stack.Screen name="DeviceSubtype" component={DeviceSubtypeScreen} />
        <Stack.Screen name="DeviceList" component={DeviceListScreen} />
        <Stack.Screen name="CommutatorList" component={CommutatorListScreen} />
        <Stack.Screen name="PortList" component={PortListScreen} />
        <Stack.Screen
          name="ConfigurationConfirm"
          component={ConfigurationConfirmScreen}
        />
        <Stack.Screen name="DiagnosticMain" component={DiagnosticMainScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Keys" component={KeysScreen} />
        <Stack.Screen name="Apartments" component={ApartmentsScreen} />
        <Stack.Screen name="Matrix" component={MatrixScreen} />
        <Stack.Screen name="Entrance" component={EntranceScreen} />
        <Stack.Screen name="RunningLine" component={RunningLineScreen} />
        <Stack.Screen name="Sound" component={SoundScreen} />
        <Stack.Screen name="Equalizer" component={EqualizerScreen} />
        <Stack.Screen name="SipAccount" component={SipAccountScreen} />
                <Stack.Screen name="VideoStream" component={VideoStreamScreen} />
                <Stack.Screen name="DDNS" component={DDNSScreen} />
                <Stack.Screen name="NetworkSettings" component={NetworkSettingsScreen} />
        <Stack.Screen name="Syslog" component={SyslogScreen} />
        <Stack.Screen name="Update" component={UpdateScreen} />
        <Stack.Screen name="DateTime" component={DateTimeScreen} />
        <Stack.Screen name="Reboot" component={RebootScreen} />
        <Stack.Screen name="Reset" component={ResetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
