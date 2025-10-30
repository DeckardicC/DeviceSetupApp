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
import {Port} from '../types';

const PortListScreen = observer(({navigation}: any) => {
  const {selectedPort} = deviceStore;

  const ports: Port[] = Array.from({length: 24}, (_, i) => ({
    id: i + 1,
    name: `Порт ${i + 1}`,
    isAvailable: Math.random() > 0.3,
    isDisconnected: Math.random() > 0.8,
  }));

  const handlePortSelect = (port: Port) => {
    if (port.isAvailable) {
      deviceStore.setPort(port);
    }
  };

  const handleConfigure = () => {
    if (selectedPort) {
      navigation.navigate('ConfigurationConfirm');
    }
  };

  const renderPort = ({item, index}: {item: Port; index: number}) => {
    const isSelected = selectedPort?.id === item.id;
    const isFirst = index === 0;
    const isLast = index === ports.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.portItem,
          !item.isAvailable && styles.portDisabled,
          item.isDisconnected && styles.portDisconnected,
          isFirst && styles.portItemFirst,
          isLast && styles.portItemLast,
          !isLast && styles.portItemBorder,
        ]}
        onPress={() => handlePortSelect(item)}
        disabled={!item.isAvailable}>
        <Text style={styles.portText}>{item.name}</Text>
        {isSelected && <Icon name="check-circle" size={20} color="#fff" />}
        {!item.isAvailable && (
          <Icon name="block" size={20} color="rgba(255,255,255,0.7)" />
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
        <Text style={styles.headerTitle}>Выбор порта</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Выбор порта:</Text>
        </View>

        <View style={styles.whiteContainer}>
          <FlatList
            data={ports}
            renderItem={renderPort}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            numColumns={3}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.configureButton,
            !selectedPort && styles.configureButtonDisabled,
          ]}
          onPress={handleConfigure}
          disabled={!selectedPort}>
          <Text style={styles.configureButtonText}>Настроить</Text>
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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 80,
  },
  portItem: {
    flex: 1,
    backgroundColor: '#8BC34A',
    padding: 12,
    margin: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  portItemFirst: {
    marginTop: 0,
  },
  portItemLast: {
    marginBottom: 0,
  },
  portItemBorder: {},
  portDisabled: {
    backgroundColor: '#FF5252',
  },
  portDisconnected: {
    backgroundColor: '#FFA726',
  },
  portText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  configureButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  configureButtonDisabled: {
    backgroundColor: '#ccc',
  },
  configureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PortListScreen;

