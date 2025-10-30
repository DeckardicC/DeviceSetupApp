import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {observer} from 'mobx-react-lite';
import {deviceStore} from '../stores/DeviceStore';

const DeviceSubtypeScreen = observer(({navigation}: any) => {
  const {selectedDeviceType} = deviceStore;

  const getDeviceTypeLabel = () => {
    return selectedDeviceType === 'callPanel' ? 'Вызывная панель' : 'Камера';
  };

  const getSubtypes = () => {
    if (selectedDeviceType === 'callPanel') {
      return [
        {id: 'mainEntrance', label: 'Основной вход', icon: 'meeting-room'},
        {id: 'gate', label: 'Калитка', icon: 'sensor-door'},
      ];
    }
    if (selectedDeviceType === 'camera') {
      return [
        {id: 'external', label: 'Внешняя', icon: 'camera-outdoor'},
        {id: 'internal', label: 'Внутренняя', icon: 'camera-indoor'},
      ];
    }
    return [];
  };

  const handleSubtypeSelect = (subtypeId: string) => {
    deviceStore.setDeviceSubtype(subtypeId as any);
    navigation.navigate('DeviceList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Тип устройства</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Text style={styles.infoText}>
          Тип: {getDeviceTypeLabel()} | Подтип: —
        </Text>

        <View style={styles.whiteContainer}>
          {getSubtypes().map((subtype, index) => (
            <React.Fragment key={subtype.id}>
              {index > 0 && <View style={styles.divider} />}
              <TouchableOpacity
                style={[
                  styles.option,
                  index === 0 && styles.optionFirst,
                  index === getSubtypes().length - 1 && styles.optionLast,
                ]}
                onPress={() => handleSubtypeSelect(subtype.id)}>
                <Icon name={subtype.icon} size={24} color="#000" />
                <Text style={styles.optionText}>{subtype.label}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  optionFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optionLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
});

export default DeviceSubtypeScreen;

