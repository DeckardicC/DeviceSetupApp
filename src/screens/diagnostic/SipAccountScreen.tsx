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

const SipAccountScreen = ({navigation}: any) => {
  // Mock данные - в реальном приложении будет получаться с устройства
  const isRegistered = true;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SIP-Аккаунт</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Статус SIP-регистрации</Text>

        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <View style={styles.statusLeft}>
              <Icon
                name={isRegistered ? 'check-circle' : 'error'}
                size={48}
                color={isRegistered ? '#5B9FED' : '#F44336'}
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Статус регистрации</Text>
                <Text
                  style={[
                    styles.statusValue,
                    isRegistered ? styles.statusRegistered : styles.statusNotRegistered,
                  ]}>
                  {isRegistered ? 'Зарегистрирован' : 'Не зарегистрирован'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusIndicator,
                isRegistered
                  ? styles.statusIndicatorGreen
                  : styles.statusIndicatorRed,
              ]}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoBox}>
            <Icon name="info-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              Устройство должно быть всегда зарегистрировано для корректной работы SIP-вызовов. 
              Если статус "Не зарегистрирован", проверьте настройки сети и SIP-сервера.
            </Text>
          </View>
        </View>

        {!isRegistered && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Icon name="warning" size={24} color="#FF9800" />
              <Text style={styles.alertTitle}>Требуется внимание</Text>
            </View>
            <Text style={styles.alertText}>
              SIP-регистрация отсутствует. Проверьте:
            </Text>
            <View style={styles.checkList}>
              <Text style={styles.checkItem}>• Подключение к сети</Text>
              <Text style={styles.checkItem}>• Настройки SIP-сервера</Text>
              <Text style={styles.checkItem}>• Логин и пароль SIP-аккаунта</Text>
            </View>
          </View>
        )}
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
  scrollContent: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusRegistered: {
    color: '#5B9FED',
  },
  statusNotRegistered: {
    color: '#F44336',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  statusIndicatorGreen: {
    backgroundColor: '#5B9FED',
  },
  statusIndicatorRed: {
    backgroundColor: '#F44336',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  alertCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9800',
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  checkList: {
    marginTop: 4,
  },
  checkItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
});

export default SipAccountScreen;

