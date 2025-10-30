import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {observer} from 'mobx-react-lite';
import {deviceStore} from '../stores/DeviceStore';
import {Device} from '../types';

const DeviceListScreen = observer(({navigation}: any) => {
  const {selectedDeviceType, selectedDeviceSubtype, devices} = deviceStore;

  const getDeviceTypeLabel = () => {
    return selectedDeviceType === 'callPanel' ? 'Вызывная панель' : 'Камера';
  };

  const getSubtypeLabel = () => {
    if (selectedDeviceSubtype === 'mainEntrance') return 'Основной вход';
    if (selectedDeviceSubtype === 'gate') return 'Калитка';
    if (selectedDeviceSubtype === 'external') return 'Внешняя';
    if (selectedDeviceSubtype === 'internal') return 'Внутренняя';
    return '—';
  };

  const filteredDevices = devices.filter(
    d => d.type === selectedDeviceType && d.subtype === selectedDeviceSubtype,
  );

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (a.isConfigured && !b.isConfigured) return 1;
    if (!a.isConfigured && b.isConfigured) return -1;
    return 0;
  });

  const handleDeviceToggle = (device: Device) => {
    if (!device.isConfigured) {
      deviceStore.toggleDeviceSelection(device);
    }
  };

  const handleNext = () => {
    if (deviceStore.selectedDevices.length > 0) {
      navigation.navigate('CommutatorList');
    }
  };

  const renderDevice = ({item, index}: {item: Device; index: number}) => {
    const isSelected = deviceStore.isDeviceSelected(item);
    const iconName = item.type === 'callPanel' ? 'phone' : 'videocam';
    const isFirst = index === 0;
    const isLast = index === sortedDevices.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.deviceItem,
          item.isConfigured && styles.deviceConfigured,
          isFirst && styles.deviceItemFirst,
          isLast && styles.deviceItemLast,
          !isLast && styles.deviceItemBorder,
        ]}
        onPress={() => handleDeviceToggle(item)}
        disabled={item.isConfigured}>
        <View style={styles.deviceContent}>
          <Icon
            name={iconName}
            size={24}
            color={item.isConfigured ? '#999' : '#000'}
          />
          <Text
            style={[
              styles.deviceName,
              item.isConfigured && styles.deviceNameConfigured,
            ]}>
            {item.name}
          </Text>
        </View>
        {isSelected && <Icon name="check-circle" size={24} color="#5B9FED" />}
        {item.isConfigured && (
          <Icon name="check-circle" size={24} color="#999" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Выбор устройств</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Text style={styles.infoText}>
          Тип: {getDeviceTypeLabel()} | Подтип: {getSubtypeLabel()}
        </Text>

        <View style={styles.whiteContainer}>
          <FlatList
            data={sortedDevices}
            renderItem={renderDevice}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            deviceStore.selectedDevices.length === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={deviceStore.selectedDevices.length === 0}>
          <Text style={styles.nextButtonText}>
            Далее ({deviceStore.selectedDevices.length})
          </Text>
        </TouchableOpacity>
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
    marginBottom: 80,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
  },
  deviceItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  deviceItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  deviceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  deviceConfigured: {
    opacity: 0.5,
  },
  deviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  deviceNameConfigured: {
    color: '#999',
  },
  nextButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DeviceListScreen;

