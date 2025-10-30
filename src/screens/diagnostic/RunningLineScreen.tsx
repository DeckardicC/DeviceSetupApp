import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RunningLineScreen = ({navigation}: any) => {
  const [enabled, setEnabled] = useState(true);
  const [speed, setSpeed] = useState('Нормально');
  const [text, setText] = useState('Вас приветствует GoodLine');
  const [speedModalVisible, setSpeedModalVisible] = useState(false);

  const speedOptions = ['Медленно', 'Нормально', 'Быстро', 'Очень быстро'];

  const handleSave = () => {
    // Здесь будет логика сохранения
    console.log('Saving running line settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Бегущая строка</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Настройка бегущей строки</Text>

        <View style={styles.card}>
          {/* Переключатель бегущей строки */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Бегущая строка</Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{false: '#ccc', true: '#5B9FED'}}
              thumbColor="#fff"
            />
          </View>

          {enabled && (
            <>
              <View style={styles.divider} />

              {/* Скорость бегущей строки */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Скорость бегущей строки <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setSpeedModalVisible(true)}>
                  <Text style={styles.selectInputText}>{speed}</Text>
                  <Icon name="arrow-drop-down" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* Текст бегущей строки */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Текст бегущей строки <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={text}
                    onChangeText={setText}
                    placeholder="Введите текст бегущей строки"
                    placeholderTextColor="#999"
                    multiline={false}
                    maxLength={100}
                    editable={true}
                    selectTextOnFocus={true}
                  />
                  {text.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setText('')}>
                      <Icon name="close" size={20} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.charCount}>
                  Количество символов для ввода: {text.length}
                </Text>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальное окно выбора скорости */}
      <Modal
        visible={speedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSpeedModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSpeedModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Скорость бегущей строки</Text>
            {speedOptions.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  index === speedOptions.length - 1 && styles.modalOptionLast,
                ]}
                onPress={() => {
                  setSpeed(option);
                  setSpeedModalVisible(false);
                }}>
                <Text
                  style={[
                    styles.modalOptionText,
                    speed === option && styles.modalOptionTextActive,
                  ]}>
                  {option}
                </Text>
                {speed === option && (
                  <Icon name="check" size={20} color="#5B9FED" />
                )}
              </TouchableOpacity>
            ))}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  selectInputText: {
    fontSize: 15,
    color: '#000',
  },
  textInputContainer: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#000',
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalOptionLast: {
    borderBottomWidth: 0,
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

export default RunningLineScreen;

