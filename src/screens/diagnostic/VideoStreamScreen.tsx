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

const VideoStreamScreen = ({navigation}: any) => {
  const [selectedStream, setSelectedStream] = useState<'main' | 'second'>('main');

  // Основной поток
  const [mainCodec, setMainCodec] = useState('H264');
  const [mainProfile, setMainProfile] = useState('Baseline');
  const [mainResolution, setMainResolution] = useState('1920x1080');
  const [mainFramerate, setMainFramerate] = useState('22');
  const [mainBitrateMode, setMainBitrateMode] = useState('VBR');
  const [mainBitrate, setMainBitrate] = useState('4096');
  const [mainInterval, setMainInterval] = useState('11');

  // Второй поток
  const [secondCodec, setSecondCodec] = useState('H264');
  const [secondProfile, setSecondProfile] = useState('Baseline');
  const [secondResolution, setSecondResolution] = useState('640x480');
  const [secondFramerate, setSecondFramerate] = useState('15');
  const [secondBitrateMode, setSecondBitrateMode] = useState('VBR');
  const [secondBitrate, setSecondBitrate] = useState('1024');
  const [secondInterval, setSecondInterval] = useState('11');

  // Модальные окна
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [showBitrateModeModal, setShowBitrateModeModal] = useState(false);
  const [showBitrateModal, setShowBitrateModal] = useState(false);

  // Опции для выбора
  const profiles = ['Baseline', 'Main', 'High'];
  const resolutions = [
    '1920x1080',
    '1280x720',
    '720x576',
    '704x576',
    '640x480',
    '640x360',
  ];
  const bitrateModes = ['VBR', 'CBR', 'CVBR', 'AVBR', 'FIXQP', 'QVBR'];
  
  // Генерация битрейтов с шагом 512 от 512 до 16384
  const bitrates = [];
  for (let i = 512; i <= 16384; i += 512) {
    bitrates.push(i.toString());
  }

  const handleSave = () => {
    console.log('Saving video stream settings');
  };

  const handleSelectProfile = (value: string) => {
    if (selectedStream === 'main') {
      setMainProfile(value);
    } else {
      setSecondProfile(value);
    }
    setShowProfileModal(false);
  };

  const handleSelectResolution = (value: string) => {
    if (selectedStream === 'main') {
      setMainResolution(value);
    } else {
      setSecondResolution(value);
    }
    setShowResolutionModal(false);
  };

  const handleSelectBitrateMode = (value: string) => {
    if (selectedStream === 'main') {
      setMainBitrateMode(value);
    } else {
      setSecondBitrateMode(value);
    }
    setShowBitrateModeModal(false);
  };

  const handleSelectBitrate = (value: string) => {
    if (selectedStream === 'main') {
      setMainBitrate(value);
    } else {
      setSecondBitrate(value);
    }
    setShowBitrateModal(false);
  };

  const renderModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    options: string[],
    currentValue: string,
    onSelect: (value: string) => void,
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.modalScroll}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => onSelect(option)}>
                <Text
                  style={[
                    styles.modalOptionText,
                    currentValue === option && styles.modalOptionTextActive,
                  ]}>
                  {option}
                </Text>
                {currentValue === option && (
                  <Icon name="check" size={20} color="#5B9FED" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderStreamSettings = () => {
    const isMain = selectedStream === 'main';
    const codec = isMain ? mainCodec : secondCodec;
    const profile = isMain ? mainProfile : secondProfile;
    const resolution = isMain ? mainResolution : secondResolution;
    const framerate = isMain ? mainFramerate : secondFramerate;
    const bitrateMode = isMain ? mainBitrateMode : secondBitrateMode;
    const bitrate = isMain ? mainBitrate : secondBitrate;
    const interval = isMain ? mainInterval : secondInterval;

    const setCodec = isMain ? setMainCodec : setSecondCodec;
    const setFramerate = isMain ? setMainFramerate : setSecondFramerate;
    const setBitrate = isMain ? setMainBitrate : setSecondBitrate;
    const setInterval = isMain ? setMainInterval : setSecondInterval;

    return (
      <View style={styles.settingsContainer}>
        {/* Параметры */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Параметры</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Тип кодека</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{codec}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Профиль кодека *</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowProfileModal(true)}>
              <Text style={styles.selectText}>{profile}</Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Разрешение *</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowResolutionModal(true)}>
              <Text style={styles.selectText}>{resolution}</Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Частота кадров *</Text>
            <TextInput
              style={styles.input}
              value={framerate}
              onChangeText={setFramerate}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <Text style={styles.hint}>Ограничение от 6 до 30</Text>
          </View>
        </View>

        {/* Битрейт */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Битрейт</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Режим управления кодированием *
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowBitrateModeModal(true)}>
              <Text style={styles.selectText}>{bitrateMode}</Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Максимальный битрейт (Кбит/сек) *
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowBitrateModal(true)}>
              <Text style={styles.selectText}>{bitrate}</Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Интервал опорного кадра (кадр/сек) *
            </Text>
            <TextInput
              style={styles.input}
              value={interval}
              onChangeText={setInterval}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <Text style={styles.hint}>Ограничение от 1 до 200</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Видеопоток</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Настройка видеопотока</Text>

        {/* Табы выбора потока */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedStream === 'main' && styles.tabActive,
            ]}
            onPress={() => setSelectedStream('main')}>
            <Icon
              name="videocam"
              size={20}
              color={selectedStream === 'main' ? '#fff' : '#5B9FED'}
            />
            <Text
              style={[
                styles.tabText,
                selectedStream === 'main' && styles.tabTextActive,
              ]}>
              Основной поток
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedStream === 'second' && styles.tabActive,
            ]}
            onPress={() => setSelectedStream('second')}>
            <Icon
              name="videocam"
              size={20}
              color={selectedStream === 'second' ? '#fff' : '#5B9FED'}
            />
            <Text
              style={[
                styles.tabText,
                selectedStream === 'second' && styles.tabTextActive,
              ]}>
              Второй поток
            </Text>
          </TouchableOpacity>
        </View>

        {renderStreamSettings()}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальные окна */}
      {renderModal(
        showProfileModal,
        () => setShowProfileModal(false),
        'Профиль кодека',
        profiles,
        selectedStream === 'main' ? mainProfile : secondProfile,
        handleSelectProfile,
      )}
      {renderModal(
        showResolutionModal,
        () => setShowResolutionModal(false),
        'Разрешение',
        resolutions,
        selectedStream === 'main' ? mainResolution : secondResolution,
        handleSelectResolution,
      )}
      {renderModal(
        showBitrateModeModal,
        () => setShowBitrateModeModal(false),
        'Режим управления кодированием',
        bitrateModes,
        selectedStream === 'main' ? mainBitrateMode : secondBitrateMode,
        handleSelectBitrateMode,
      )}
      {renderModal(
        showBitrateModal,
        () => setShowBitrateModal(false),
        'Максимальный битрейт (Кбит/сек)',
        bitrates,
        selectedStream === 'main' ? mainBitrate : secondBitrate,
        handleSelectBitrate,
      )}
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
    padding: 12,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5B9FED',
  },
  tabActive: {
    backgroundColor: '#5B9FED',
    borderColor: '#5B9FED',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B9FED',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#fff',
  },
  settingsContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  valueBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  valueText: {
    fontSize: 14,
    color: '#5B9FED',
    fontWeight: '600',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
    color: '#000',
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#5B9FED',
    padding: 14,
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

export default VideoStreamScreen;

