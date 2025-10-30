import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SyslogScreen = ({navigation}: any) => {
  const [serverAddress, setServerAddress] = useState('10.102.137.95');
  const [serverPort, setServerPort] = useState('5140');
  const [protocol, setProtocol] = useState<'TCP' | 'UDP'>('TCP');
  const [logLevel, setLogLevel] = useState('Debug');
  const [showLogLevelModal, setShowLogLevelModal] = useState(false);

  const logLevels = [
    'Emergency',
    'Alert',
    'Critical',
    'Error',
    'Warning',
    'Notice',
    'Info',
    'Debug',
  ];

  const handleSave = () => {
    console.log('Saving Syslog settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Syslog-сервер</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          Настройка удаленного журналирования
        </Text>

        <View style={styles.formContainer}>
          {/* Левая колонка */}
          <View style={styles.leftColumn}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Адрес сервера *</Text>
              <TextInput
                style={styles.input}
                value={serverAddress}
                onChangeText={setServerAddress}
                placeholder="10.102.137.95"
                placeholderTextColor="#666"
                editable={true}
                selectTextOnFocus={true}
              />
              <Text style={styles.hint}>Количество символов для ввода: 115</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Порт сервера *</Text>
              <TextInput
                style={styles.input}
                value={serverPort}
                onChangeText={setServerPort}
                placeholder="5140"
                placeholderTextColor="#666"
                keyboardType="numeric"
                editable={true}
                selectTextOnFocus={true}
              />
              <Text style={styles.hint}>Ограничение от 1 до 65535</Text>
            </View>
          </View>

          {/* Правая колонка */}
          <View style={styles.rightColumn}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Протокол передачи данных</Text>
              <View style={styles.protocolSelector}>
                <TouchableOpacity
                  style={[
                    styles.protocolButton,
                    protocol === 'TCP' && styles.protocolButtonActive,
                  ]}
                  onPress={() => setProtocol('TCP')}>
                  <View
                    style={[
                      styles.radio,
                      protocol === 'TCP' && styles.radioActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.protocolButtonText,
                      protocol === 'TCP' && styles.protocolButtonTextActive,
                    ]}>
                    TCP
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.protocolButton,
                    protocol === 'UDP' && styles.protocolButtonActive,
                  ]}
                  onPress={() => setProtocol('UDP')}>
                  <View
                    style={[
                      styles.radio,
                      protocol === 'UDP' && styles.radioActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.protocolButtonText,
                      protocol === 'UDP' && styles.protocolButtonTextActive,
                    ]}>
                    UDP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Уровень логирования *</Text>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setShowLogLevelModal(true)}>
                <Text style={styles.selectText}>{logLevel}</Text>
                <Icon name="arrow-drop-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальное окно выбора уровня логирования */}
      <Modal
        visible={showLogLevelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogLevelModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLogLevelModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Уровень логирования</Text>
            <ScrollView style={styles.modalScroll}>
              {logLevels.map(level => (
                <TouchableOpacity
                  key={level}
                  style={styles.modalOption}
                  onPress={() => {
                    setLogLevel(level);
                    setShowLogLevelModal(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      logLevel === level && styles.modalOptionTextActive,
                    ]}>
                    {level}
                  </Text>
                  {logLevel === level && (
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
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftColumn: {
    gap: 20,
  },
  rightColumn: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  hint: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  protocolSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  protocolButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  protocolButtonActive: {
    borderColor: '#5B9FED',
    backgroundColor: '#EBF5FF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#5B9FED',
    backgroundColor: '#5B9FED',
  },
  protocolButtonText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  protocolButtonTextActive: {
    color: '#5B9FED',
    fontWeight: '600',
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

export default SyslogScreen;

