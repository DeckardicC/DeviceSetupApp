import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MainScreen = ({navigation}: any) => {
  // Моковые данные для примера
  const deviceData = {
    panelModel: 'Сокол Плюс (рев. 5)',
    cameraModel: 'GK7205V300',
    macAddress: '08:53:C0:18:74:3E',
    serialNumber: '53CD18743E',
    temperature: '75.37 °C',
    inputVoltage: '12.2 В',
    uptime: '5д. 22ч. 24м. 6с.',
    optVersion: '2.5.0.12.8',
    optDate: '2025-06-19',
    mediaVersion: '2.5.0.11.2',
    mediaDate: '2024-12-20',
    rootfsVersion: '2.5.0.12.8',
    rootfsDate: '2025-06-19',
    sipRegistered: false,
    gateMode: 'Выключен',
  };

  const renderInfoRow = (label: string, value: string, isLast = false) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderInfoRowWithIcon = (
    label: string,
    icon: JSX.Element,
    isLast = false,
  ) => (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoIconContainer}>{icon}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Данные о панели</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.whiteContainer}>
          {renderInfoRow('Модель панели', deviceData.panelModel)}
          {renderInfoRow('Модель камеры', deviceData.cameraModel)}
          {renderInfoRow('MAC-адрес', deviceData.macAddress)}
          {renderInfoRow('Серийный номер', deviceData.serialNumber)}
          {renderInfoRow('Температура', deviceData.temperature)}
          {renderInfoRow('Входное напряжение', deviceData.inputVoltage)}
          {renderInfoRow(
            'Время непрерывной работы',
            deviceData.uptime,
            true,
          )}
        </View>

        <Text style={styles.sectionTitle}>Версия ПО</Text>
        <View style={styles.whiteContainer}>
          <View style={[styles.versionContainer, styles.versionContainerFirst]}>
            <Text style={styles.versionText}>
              opt: {deviceData.optVersion}
            </Text>
            <Text style={styles.versionDate}>{deviceData.optDate}</Text>
          </View>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              media: {deviceData.mediaVersion}
            </Text>
            <Text style={styles.versionDate}>{deviceData.mediaDate}</Text>
          </View>
          <View style={[styles.versionContainer, styles.versionContainerLast]}>
            <Text style={styles.versionText}>
              rootfs: {deviceData.rootfsVersion}
            </Text>
            <Text style={styles.versionDate}>{deviceData.rootfsDate}</Text>
          </View>
        </View>

        <View style={styles.whiteContainer}>
          {renderInfoRowWithIcon(
            'SIP-регистрация',
            <View style={styles.sipContainer}>
              <View
                style={[
                  styles.statusDot,
                  deviceData.sipRegistered
                    ? styles.statusDotGreen
                    : styles.statusDotRed,
                ]}
              />
            </View>,
          )}
          {renderInfoRow('Режим калитки', deviceData.gateMode, true)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 15,
    color: '#000',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#666',
    textAlign: 'right',
    flex: 1,
  },
  infoIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusDotGreen: {
    backgroundColor: '#5B9FED',
  },
  statusDotRed: {
    backgroundColor: '#F44336',
  },
  versionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  versionContainerFirst: {
    paddingTop: 16,
  },
  versionContainerLast: {
    borderBottomWidth: 0,
    paddingBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  versionDate: {
    fontSize: 13,
    color: '#999',
  },
});

export default MainScreen;

