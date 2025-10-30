import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ModeSelectionScreen = ({navigation}: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Выберите режим работы</Text>

        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => navigation.navigate('DeviceType')}>
          <View style={styles.iconContainer}>
            <Icon name="settings-ethernet" size={48} color="#5B9FED" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.modeTitle}>M2.1. Автоматическая настройка</Text>
            <Text style={styles.modeDescription}>
              Настройка сетевых параметров устройства
            </Text>
          </View>
          <Icon name="chevron-right" size={32} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => navigation.navigate('DiagnosticMain')}>
          <View style={styles.iconContainer}>
            <Icon name="troubleshoot" size={48} color="#5B9FED" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.modeTitle}>M2.2. Диагностика</Text>
            <Text style={styles.modeDescription}>
              Просмотр и настройка параметров устройства
            </Text>
          </View>
          <Icon name="chevron-right" size={32} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Версия приложения: 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ModeSelectionScreen;

