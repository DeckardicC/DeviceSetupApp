import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface NTPServer {
  id: string;
  address: string;
}

const DateTimeScreen = ({navigation}: any) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [timezone, setTimezone] = useState('Asia/Krasnoyarsk');
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [ntpServers, setNtpServers] = useState<NTPServer[]>([
    {id: '1', address: 'ntp.goodline.info'},
  ]);

  const timezones = [
    'UTC',
    'Europe/Moscow',
    'Europe/Kaliningrad',
    'Asia/Yekaterinburg',
    'Asia/Omsk',
    'Asia/Krasnoyarsk',
    'Asia/Irkutsk',
    'Asia/Yakutsk',
    'Asia/Vladivostok',
    'Asia/Magadan',
    'Asia/Kamchatka',
  ];

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setCurrentDateTime(`${day}.${month}.${year} — ${hours}:${minutes}:${seconds}`);
  };

  const handleAddNTPServer = () => {
    const newId = String(ntpServers.length + 1);
    setNtpServers([...ntpServers, {id: newId, address: ''}]);
  };

  const handleDeleteNTPServer = (id: string) => {
    if (ntpServers.length <= 1) {
      Alert.alert('Ошибка', 'Должен быть хотя бы один NTP-сервер');
      return;
    }
    setNtpServers(ntpServers.filter(server => server.id !== id));
  };

  const handleCopyNTPServer = (address: string) => {
    Clipboard.setString(address);
    Alert.alert('Скопировано', `Адрес ${address} скопирован в буфер обмена`);
  };

  const handleNTPServerChange = (id: string, address: string) => {
    setNtpServers(
      ntpServers.map(server =>
        server.id === id ? {...server, address} : server,
      ),
    );
  };

  const handleSave = () => {
    // Проверка заполненности NTP-серверов
    for (const server of ntpServers) {
      if (!server.address.trim()) {
        Alert.alert('Ошибка', 'Заполните адреса всех NTP-серверов');
        return;
      }
    }
    Alert.alert('Успешно', 'Настройки даты и времени сохранены');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки даты и времени</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cardsContainer}>
          {/* Часовой пояс */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Часовой пояс</Text>

            <View style={styles.dateTimeDisplay}>
              <Text style={styles.dateTimeLabel}>Текущие дата и время</Text>
              <Text style={styles.dateTimeValue}>{currentDateTime}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Часовой пояс *</Text>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setShowTimezoneModal(true)}>
                <Text style={styles.selectText}>{timezone}</Text>
                <Icon name="arrow-drop-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* NTP-сервер */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>NTP-сервер</Text>

            {ntpServers.map((server, index) => (
              <View key={server.id} style={styles.ntpServerRow}>
                <View style={styles.ntpInputContainer}>
                  <Text style={styles.inputLabel}>NTP-сервер *</Text>
                  <View style={styles.ntpInputWrapper}>
                    <TextInput
                      style={styles.ntpInput}
                      value={server.address}
                      onChangeText={address =>
                        handleNTPServerChange(server.id, address)
                      }
                      placeholder="ntp.goodline.info"
                      placeholderTextColor="#666"
                    />
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDeleteNTPServer(server.id)}>
                      <Icon name="close" size={20} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleCopyNTPServer(server.address)}>
                      <Icon name="content-copy" size={20} color="#999" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddNTPServer}>
              <Text style={styles.addButtonText}>Добавить еще</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальное окно выбора часового пояса */}
      <Modal
        visible={showTimezoneModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimezoneModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimezoneModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите часовой пояс</Text>
            <ScrollView style={styles.modalScroll}>
              {timezones.map(tz => (
                <TouchableOpacity
                  key={tz}
                  style={styles.modalOption}
                  onPress={() => {
                    setTimezone(tz);
                    setShowTimezoneModal(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      timezone === tz && styles.modalOptionTextActive,
                    ]}>
                    {tz}
                  </Text>
                  {timezone === tz && (
                    <Icon name="check" size={20} color="#5B9FED" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  cardsContainer: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  dateTimeDisplay: {
    marginBottom: 20,
  },
  dateTimeLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B9FED',
  },
  inputGroup: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectText: {
    fontSize: 14,
    color: '#000',
  },
  ntpServerRow: {
    marginBottom: 16,
  },
  ntpInputContainer: {
    flex: 1,
  },
  ntpInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingRight: 8,
  },
  ntpInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#000',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B9FED',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#5B9FED',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000',
  },
  modalOptionTextActive: {
    color: '#5B9FED',
    fontWeight: '600',
  },
});

export default DateTimeScreen;

