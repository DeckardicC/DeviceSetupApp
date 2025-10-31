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
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

interface Apartment {
  id: string;
  number: string;
}

type SettingsTab = 'basic' | 'audio' | 'keys' | 'codes' | 'sip' | 'diagnostic';

const ApartmentsScreen = ({navigation}: any) => {
  // Генерируем квартиры от 1 до 100
  const generateApartments = (): Apartment[] => {
    const apts: Apartment[] = [];
    for (let i = 1; i <= 100; i++) {
      apts.push({
        id: i.toString(),
        number: i.toString(),
      });
    }
    return apts;
  };

  const [apartments] = useState<Apartment[]>(generateApartments());
  const [searchText, setSearchText] = useState('');
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [generalLevelsModalVisible, setGeneralLevelsModalVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<SettingsTab>('basic');
  const itemsPerPage = 20;

  // Состояние для тестового звонка
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [testCallType, setTestCallType] = useState('');
  const [testCallDropdownOpen, setTestCallDropdownOpen] = useState(false);
  
  const testCallOptions = [
    'Вызов в аналоговую трубку (без проверок)',
    'Вызов в SIP (без проверок)',
    'Вызов в аналоговую трубку и SIP',
  ];
  
  // Состояние для кодов
  const [codes, setCodes] = useState<string[]>(['10880', '91885']);
  const [newCode, setNewCode] = useState('');
  const [codeInputVisible, setCodeInputVisible] = useState(false);
  
  // Состояние для SIP номеров
  const [sipNumbers, setSipNumbers] = useState<string[]>(['1']);
  const [newSipNumber, setNewSipNumber] = useState('');
  const [sipInputVisible, setSipInputVisible] = useState(false);
  
  // Состояние для меню ключей
  const [keysMenuVisible, setKeysMenuVisible] = useState(false);
  const [keysManagementModalVisible, setKeysManagementModalVisible] = useState(false);
  const [reverseIdentifierCheck, setReverseIdentifierCheck] = useState(true);
  
  // Состояние для добавления ключа в настройках квартиры
  const [addKeyModalVisible, setAddKeyModalVisible] = useState(false);
  const [nfcReading, setNfcReading] = useState(false);
  const [scannedKeyId, setScannedKeyId] = useState('');
  const [keyName, setKeyName] = useState('');
  const [addKeyStep, setAddKeyStep] = useState<'nfc' | 'name'>('nfc');
  const [nfcAttempted, setNfcAttempted] = useState(false);

  const tabs: SettingsTab[] = ['basic', 'audio', 'keys', 'codes', 'sip', 'diagnostic'];
  const tabNames: Record<SettingsTab, string> = {
    basic: 'Основные',
    audio: 'Аудио',
    keys: 'Ключи',
    codes: 'Коды',
    sip: 'SIP-номер',
    diagnostic: 'Диагностика',
  };

  const goToPreviousTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const goToNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Общие уровни трубок
  const [generalStandardLevels, setGeneralStandardLevels] = useState(false);
  const [pickupVoltage, setPickupVoltage] = useState('9.5');
  const [malfunctionVoltage, setMalfunctionVoltage] = useState('2');
  const [liftingVoltage, setLiftingVoltage] = useState('5');
  const [doorOpenVoltage, setDoorOpenVoltage] = useState('9');

  // Настройки квартиры - Основные
  const [voiceOpening, setVoiceOpening] = useState(true);
  const [analogRinging, setAnalogRinging] = useState(false);
  const [sipRinging, setSipRinging] = useState(true);

  // Настройки квартиры - Аудио
  const [ringVolume, setRingVolume] = useState(1);
  const [conversationVolume, setConversationVolume] = useState(3);
  const [panelVolume, setPanelVolume] = useState(12);
  const [gateRingVolume, setGateRingVolume] = useState(16);
  const [gateConversationVolume, setGateConversationVolume] = useState(16);
  const [micGain, setMicGain] = useState(16);

  // Тумблеры "Общедомовые" для Аудио
  const [useCommonRing, setUseCommonRing] = useState(true);
  const [useCommonConversation, setUseCommonConversation] = useState(true);
  const [useCommonPanel, setUseCommonPanel] = useState(true);
  const [useCommonSipPanel, setUseCommonSipPanel] = useState(true);
  const [useCommonGateRing, setUseCommonGateRing] = useState(true);
  const [useCommonMicGain, setUseCommonMicGain] = useState(true);

  // Настройки квартиры - Диагностика
  const [standardLevels, setStandardLevels] = useState(false);
  const [liftVoltage, setLiftVoltage] = useState('5');
  const [doorOpeningVoltage, setDoorOpeningVoltage] = useState('12');

  const filteredApartments = apartments.filter(apt =>
    apt.number.includes(searchText),
  );

  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApartments = filteredApartments.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const handleOpenSettings = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setActiveTab('basic');
    setSettingsModalVisible(true);
    setIsCallInProgress(false);
    setTestCallType('');
    setTestCallDropdownOpen(false);
  };

  const handleTestCall = () => {
    setIsCallInProgress(true);
    // Здесь будет логика звонка
  };

  const handleEndCall = () => {
    setIsCallInProgress(false);
    // Здесь будет логика завершения звонка
  };

  const handleAddCode = () => {
    if (!newCode.trim() || newCode.length !== 5) {
      Alert.alert('Ошибка', 'Код должен состоять из 5 цифр');
      return;
    }
    if (codes.includes(newCode)) {
      Alert.alert('Ошибка', 'Такой код уже существует');
      return;
    }
    setCodes([...codes, newCode]);
    setNewCode('');
    setCodeInputVisible(false);
  };

  const handleDeleteCode = (code: string) => {
    setCodes(codes.filter(c => c !== code));
  };

  const handleAddSipNumber = () => {
    if (!newSipNumber.trim()) {
      Alert.alert('Ошибка', 'Введите SIP номер');
      return;
    }
    if (sipNumbers.includes(newSipNumber)) {
      Alert.alert('Ошибка', 'Такой SIP номер уже существует');
      return;
    }
    setSipNumbers([...sipNumbers, newSipNumber]);
    setNewSipNumber('');
    setSipInputVisible(false);
  };

  const handleDeleteSipNumber = (sipNumber: string) => {
    if (sipNumbers.length <= 1) {
      Alert.alert('Ошибка', 'Должен быть хотя бы один SIP номер');
      return;
    }
    setSipNumbers(sipNumbers.filter(s => s !== sipNumber));
  };

  const startNFCScanForApartment = () => {
    setNfcReading(true);
    setNfcAttempted(true);
    // Симуляция NFC считывания - через 2 секунды получаем идентификатор
    // В реальном приложении здесь будет вызов NFC API
    setTimeout(() => {
      // Симуляция: 70% успех, 30% ошибка
      const success = Math.random() > 0.3;
      if (success) {
        const mockKeyId = Math.random().toString(16).substring(2, 16).toUpperCase();
        setScannedKeyId(mockKeyId);
        setNfcReading(false);
        setAddKeyStep('name');
      } else {
        setNfcReading(false);
      }
    }, 2000);
  };

  const handleSaveApartmentKey = () => {
    if (!keyName.trim()) {
      Alert.alert('Ошибка', 'Введите имя ключа');
      return;
    }

    if (!scannedKeyId) {
      Alert.alert('Ошибка', 'Не удалось считать ключ');
      return;
    }

    // Проверка, не занят ли ключ (в реальном приложении будет API запрос)
    Alert.alert('Успешно', `Ключ "${keyName}" успешно добавлен`);
    setAddKeyModalVisible(false);
    setScannedKeyId('');
    setKeyName('');
    setNfcReading(false);
    setAddKeyStep('nfc');
  };

  const handleGeneralLevels = () => {
    setMenuModalVisible(false);
    setGeneralLevelsModalVisible(true);
  };

  const handleResetPersonalSettings = () => {
    setMenuModalVisible(false);
    Alert.alert(
      'Сброс персональных настроек',
      'Вы действительно хотите выполнить сброс персональных настроек для всех квартир?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Сбросить',
          onPress: () => Alert.alert('Успешно', 'Персональные настройки сброшены'),
          style: 'destructive',
        },
      ],
    );
  };


  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Text key="ellipsis-start" style={styles.pageEllipsis}>
          ...
        </Text>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageButton, currentPage === i && styles.pageButtonActive]}
          onPress={() => setCurrentPage(i)}>
          <Text
            style={[
              styles.pageButtonText,
              currentPage === i && styles.pageButtonTextActive,
            ]}>
            {i}
          </Text>
        </TouchableOpacity>,
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <Text key="ellipsis-end" style={styles.pageEllipsis}>
          ...
        </Text>,
      );
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.pageButtonDisabled,
          ]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}>
          <Icon
            name="chevron-left"
            size={20}
            color={currentPage === 1 ? '#ccc' : '#666'}
          />
        </TouchableOpacity>

        {pages}

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.pageButtonDisabled,
          ]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}>
          <Icon
            name="chevron-right"
            size={20}
            color={currentPage === totalPages ? '#ccc' : '#666'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <ScrollView
            style={styles.settingsContent}
            contentContainerStyle={styles.settingsScrollContent}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                Голосовое сопровождение открытия
              </Text>
              <Switch
                value={voiceOpening}
                onValueChange={setVoiceOpening}
                trackColor={{false: '#ccc', true: '#5B9FED'}}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                Активировать звонки в аналоговую трубку
              </Text>
              <Switch
                value={analogRinging}
                onValueChange={setAnalogRinging}
                trackColor={{false: '#ccc', true: '#5B9FED'}}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Активировать звонки в SIP</Text>
              <Switch
                value={sipRinging}
                onValueChange={setSipRinging}
                trackColor={{false: '#ccc', true: '#5B9FED'}}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Тестовый вызов</Text>
              <TouchableOpacity
                style={styles.testCallDropdown}
                onPress={() => setTestCallDropdownOpen(!testCallDropdownOpen)}>
                <Text
                  style={[
                    styles.testCallDropdownText,
                    !testCallType && styles.testCallDropdownTextPlaceholder,
                  ]}>
                  {testCallType || 'Тестовый вызов'}
                </Text>
                <Icon
                  name={testCallDropdownOpen ? 'expand-less' : 'expand-more'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
              {testCallDropdownOpen && (
                <View style={styles.testCallDropdownList}>
                  {testCallOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.testCallDropdownItem,
                        index === testCallOptions.length - 1 &&
                          styles.testCallDropdownItemLast,
                      ]}
                      onPress={() => {
                        setTestCallType(option);
                        setTestCallDropdownOpen(false);
                      }}>
                      <Text style={styles.testCallDropdownItemText}>
                        {option}
                      </Text>
                      {testCallType === option && (
                        <Icon name="check" size={18} color="#5B9FED" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {!isCallInProgress ? (
                <TouchableOpacity
                  style={[
                    styles.testButton,
                    !testCallType && styles.testButtonDisabled,
                  ]}
                  onPress={handleTestCall}
                  disabled={!testCallType}>
                  <Text style={styles.testButtonText}>Тестовый звонок</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
                  <Text style={styles.endCallButtonText}>Завершить звонок</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        );
      case 'audio':
        return (
          <ScrollView
            style={styles.settingsContent}
            contentContainerStyle={styles.settingsScrollContent}>
            <Text style={styles.sectionTitle}>Вызовы в аналоговые трубки</Text>
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Громкость мелодии трубки</Text>
                <Switch
                  value={useCommonRing}
                  onValueChange={setUseCommonRing}
                  trackColor={{false: '#ccc', true: '#5B9FED'}}
                  thumbColor="#fff"
                />
                <Text style={styles.sliderMode}>Общедомовые</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{ringVolume}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={1}
                  value={ringVolume}
                  onValueChange={setRingVolume}
                  minimumTrackTintColor="#5B9FED"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#5B9FED"
                />
              </View>
            </View>
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Громкость разговора в трубке</Text>
                <Switch
                  value={useCommonConversation}
                  onValueChange={setUseCommonConversation}
                  trackColor={{false: '#ccc', true: '#5B9FED'}}
                  thumbColor="#fff"
                />
                <Text style={styles.sliderMode}>Общедомовые</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{conversationVolume}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={1}
                  value={conversationVolume}
                  onValueChange={setConversationVolume}
                  minimumTrackTintColor="#5B9FED"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#5B9FED"
                />
              </View>
            </View>
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>
                  Громкость разговора на панели
                </Text>
                <Switch
                  value={useCommonPanel}
                  onValueChange={setUseCommonPanel}
                  trackColor={{false: '#ccc', true: '#5B9FED'}}
                  thumbColor="#fff"
                />
                <Text style={styles.sliderMode}>Общедомовые</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{panelVolume}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={1}
                  value={panelVolume}
                  onValueChange={setPanelVolume}
                  minimumTrackTintColor="#5B9FED"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#5B9FED"
                />
              </View>
            </View>
            <Text style={styles.sectionTitle}>Вызовы в SIP</Text>
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>
                  Громкость разговора на панели
                </Text>
                <Switch
                  value={useCommonSipPanel}
                  onValueChange={setUseCommonSipPanel}
                  trackColor={{false: '#ccc', true: '#5B9FED'}}
                  thumbColor="#fff"
                />
                <Text style={styles.sliderMode}>Общедомовые</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{panelVolume}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={1}
                  value={panelVolume}
                  onValueChange={setPanelVolume}
                  minimumTrackTintColor="#5B9FED"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#5B9FED"
                />
              </View>
            </View>
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>
                  Громкость в трубке при вызове с калитки
                </Text>
                <Switch
                  value={useCommonGateRing}
                  onValueChange={setUseCommonGateRing}
                  trackColor={{false: '#ccc', true: '#5B9FED'}}
                  thumbColor="#fff"
                />
                <Text style={styles.sliderMode}>Общедомовые</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{gateRingVolume}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={1}
                  value={gateRingVolume}
                  onValueChange={setGateRingVolume}
                  minimumTrackTintColor="#5B9FED"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#5B9FED"
                />
              </View>
            </View>
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>
                  Усиление микрофона панели
                </Text>
                <Switch
                  value={useCommonMicGain}
                  onValueChange={setUseCommonMicGain}
                  trackColor={{false: '#ccc', true: '#5B9FED'}}
                  thumbColor="#fff"
                />
                <Text style={styles.sliderMode}>Общедомовые</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{micGain}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={1}
                  value={micGain}
                  onValueChange={setMicGain}
                  minimumTrackTintColor="#5B9FED"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#5B9FED"
                />
              </View>
            </View>
          </ScrollView>
        );
      case 'keys':
        return (
          <ScrollView
            style={styles.settingsContent}
            contentContainerStyle={styles.settingsScrollContent}>
            <Text style={styles.inputLabel}>Добавить ключ *</Text>
            <Text style={styles.hint}>
              Нажмите кнопку и приложите ключ к телефону для NFC считывания
            </Text>
            <TouchableOpacity
              style={styles.addKeyButton}
              onPress={() => {
                setAddKeyModalVisible(true);
                setAddKeyStep('nfc');
                setScannedKeyId('');
                setKeyName('');
                setNfcReading(false);
                setNfcAttempted(false);
              }}>
              <Icon name="add" size={20} color="#5B9FED" />
              <Text style={styles.addKeyButtonText}>Добавить ключ</Text>
            </TouchableOpacity>
            <View style={styles.keysList}>
              <View style={styles.keyItem}>
                <Text style={styles.keyText}>0000002347C9C1</Text>
                <View style={styles.keyActions}>
                  <TouchableOpacity>
                    <Icon name="delete-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="settings" size={20} color="#5B9FED" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteAllButton}>
              <Icon name="delete-sweep" size={20} color="#F44336" />
              <Text style={styles.deleteAllText}>Удалить все ключи</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      case 'codes':
        return (
          <ScrollView
            style={styles.settingsContent}
            contentContainerStyle={styles.settingsScrollContent}>
            <Text style={styles.inputLabel}>Добавить код *</Text>
            <Text style={styles.hint}>Код должен состоять из 5 цифр</Text>
            {!codeInputVisible ? (
              <TouchableOpacity
                style={styles.addCodeButton}
                onPress={() => setCodeInputVisible(true)}>
                <Icon name="add" size={20} color="#5B9FED" />
                <Text style={styles.addCodeButtonText}>Добавить код</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addCodeContainer}>
                <TextInput
                  style={styles.codeInput}
                  value={newCode}
                  onChangeText={setNewCode}
                  placeholder="Введите код (5 цифр)"
                  keyboardType="numeric"
                  maxLength={5}
                  placeholderTextColor="#999"
                  autoFocus={true}
                />
                <TouchableOpacity
                  style={styles.confirmCodeButton}
                  onPress={handleAddCode}>
                  <Icon name="check" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelCodeButton}
                  onPress={() => {
                    setCodeInputVisible(false);
                    setNewCode('');
                  }}>
                  <Icon name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.keysList}>
              {codes.map((code, index) => (
                <View key={index} style={styles.keyItem}>
                  <Text style={styles.keyText}>{code}</Text>
                  <TouchableOpacity onPress={() => handleDeleteCode(code)}>
                    <Icon name="delete-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {codes.length > 0 && (
              <TouchableOpacity
                style={styles.deleteAllButton}
                onPress={() => {
                  Alert.alert(
                    'Удалить все коды',
                    'Вы уверены, что хотите удалить все коды?',
                    [
                      {text: 'Отмена', style: 'cancel'},
                      {
                        text: 'Удалить',
                        onPress: () => setCodes([]),
                        style: 'destructive',
                      },
                    ],
                  );
                }}>
                <Icon name="delete-sweep" size={20} color="#F44336" />
                <Text style={styles.deleteAllText}>Удалить все коды</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        );
      case 'sip':
        return (
          <ScrollView
            style={styles.settingsContent}
            contentContainerStyle={styles.settingsScrollContent}>
            <Text style={styles.inputLabel}>SIP-номер *</Text>
            {sipNumbers.map((sipNumber, index) => (
              <View key={index} style={styles.sipNumberItem}>
                <View style={styles.sipInputWrapper}>
                  <TextInput
                    style={[styles.input, styles.sipInput]}
                    value={sipNumber}
                    onChangeText={(text) => {
                      const updated = [...sipNumbers];
                      updated[index] = text;
                      setSipNumbers(updated);
                    }}
                    placeholder="Введите SIP номер"
                    placeholderTextColor="#999"
                  />
                  {sipNumbers.length > 1 && (
                    <TouchableOpacity
                      style={styles.deleteSipButton}
                      onPress={() => handleDeleteSipNumber(sipNumber)}>
                      <Icon name="delete-outline" size={20} color="#F44336" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            {sipInputVisible ? (
              <View style={styles.addSipContainer}>
                <View style={styles.sipInputWrapper}>
                  <TextInput
                    style={[styles.input, styles.sipInput]}
                    value={newSipNumber}
                    onChangeText={setNewSipNumber}
                    placeholder="Введите новый SIP номер"
                    placeholderTextColor="#999"
                    autoFocus={true}
                  />
                  <TouchableOpacity
                    style={styles.confirmSipButton}
                    onPress={handleAddSipNumber}>
                    <Icon name="check" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelSipButton}
                    onPress={() => {
                      setSipInputVisible(false);
                      setNewSipNumber('');
                    }}>
                    <Icon name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => setSipInputVisible(true)}>
                <Icon name="add" size={20} color="#5B9FED" />
                <Text style={styles.addMoreText}>Добавить еще</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        );
      case 'diagnostic':
        return (
          <ScrollView
            style={styles.settingsContent}
            contentContainerStyle={styles.settingsScrollContent}>
            <Text style={styles.sectionTitle}>Диагностика</Text>
            <View style={styles.diagnosticItem}>
              <Text style={styles.diagnosticLabel}>Уровень напряжения</Text>
              <Text style={styles.diagnosticValue}>Нет информации</Text>
            </View>
            <View style={styles.diagnosticItem}>
              <Text style={styles.diagnosticLabel}>Положение трубки</Text>
              <Text style={styles.diagnosticValue}>Нет информации</Text>
            </View>
            <TouchableOpacity style={styles.diagnosticButton}>
              <Text style={styles.diagnosticButtonText}>Запустить диагностику</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Уровни напряжения</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Задать стандартные уровни</Text>
              <Switch
                value={standardLevels}
                onValueChange={setStandardLevels}
                trackColor={{false: '#ccc', true: '#5B9FED'}}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.diagnosticItem}>
              <Text style={styles.diagnosticLabel}>
                Напряжение поднятия трубки
              </Text>
              <TextInput
                style={styles.diagnosticInput}
                value={liftVoltage}
                onChangeText={setLiftVoltage}
                keyboardType="numeric"
                editable={true}
                selectTextOnFocus={true}
              />
            </View>
            <View style={styles.diagnosticItem}>
              <Text style={styles.diagnosticLabel}>
                Напряжение открытия двери с трубки
              </Text>
              <TextInput
                style={styles.diagnosticInput}
                value={doorOpeningVoltage}
                onChangeText={setDoorOpeningVoltage}
                keyboardType="numeric"
                editable={true}
                selectTextOnFocus={true}
              />
            </View>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Квартиры</Text>
        <TouchableOpacity onPress={() => setMenuModalVisible(true)}>
          <Icon name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Управление квартирами</Text>

        <View style={styles.controlsContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Введите номер квартиры"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                setCurrentPage(1);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.apartmentListContainer}>
          {currentApartments.map((apt, index) => (
            <View
              key={apt.id}
              style={[
                styles.apartmentCard,
                index === currentApartments.length - 1 && styles.apartmentCardLast,
              ]}>
              <View style={styles.apartmentCardLeft}>
                <Icon name="apartment" size={24} color="#5B9FED" />
                <Text style={styles.apartmentNumber}>Квартира {apt.number}</Text>
              </View>
              <View style={styles.apartmentActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleOpenSettings(apt)}>
                  <Icon name="settings" size={22} color="#5B9FED" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {currentApartments.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="apartment" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Квартиры не найдены</Text>
            </View>
          )}
        </View>

        {renderPagination()}
      </ScrollView>

      {/* Модальное окно меню */}
      <Modal
        visible={menuModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuModalVisible(false)}>
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuModalVisible(false)}>
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handleGeneralLevels}>
              <Icon name="tune" size={20} color="#5B9FED" />
              <Text style={styles.menuItemText}>Общие уровни трубок</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleResetPersonalSettings}>
              <Icon name="restore" size={20} color="#FF9800" />
              <Text style={styles.menuItemText}>
                Сброс персональных настроек квартир
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Модальное окно настроек квартиры */}
      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}>
        <SafeAreaView style={styles.settingsModal}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>
              Настройки квартиры {selectedApartment?.number}
            </Text>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabNavigator}>
            <TouchableOpacity
              onPress={goToPreviousTab}
              disabled={tabs.indexOf(activeTab) === 0}
              style={styles.tabArrow}>
              <Icon
                name="chevron-left"
                size={24}
                color={tabs.indexOf(activeTab) === 0 ? '#ccc' : '#5B9FED'}
              />
            </TouchableOpacity>

            <View style={styles.tabIndicator}>
              <Text style={styles.tabCurrentName}>{tabNames[activeTab]}</Text>
              <Text style={styles.tabCounter}>
                {tabs.indexOf(activeTab) + 1} / {tabs.length}
              </Text>
            </View>

            <TouchableOpacity
              onPress={goToNextTab}
              disabled={tabs.indexOf(activeTab) === tabs.length - 1}
              style={styles.tabArrow}>
              <Icon
                name="chevron-right"
                size={24}
                color={tabs.indexOf(activeTab) === tabs.length - 1 ? '#ccc' : '#5B9FED'}
              />
            </TouchableOpacity>
          </View>

          {renderSettingsContent()}

          <View style={styles.settingsFooter}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => setSettingsModalVisible(false)}>
              <Text style={styles.footerButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Модальное окно общих уровней трубок */}
      <Modal
        visible={generalLevelsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGeneralLevelsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.generalLevelsModal}>
            <View style={styles.generalLevelsHeader}>
              <Text style={styles.generalLevelsTitle}>Общие уровни трубок</Text>
              <TouchableOpacity onPress={() => setGeneralLevelsModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.generalLevelsContent}
              contentContainerStyle={styles.generalLevelsContentStyle}>
              <Text style={styles.generalLevelsSectionTitle}>Уровни напряжения</Text>

              <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Задать стандартные уровни</Text>
              <Switch
                value={generalStandardLevels}
                onValueChange={setGeneralStandardLevels}
                trackColor={{false: '#ccc', true: '#5B9FED'}}
                thumbColor="#fff"
              />
              </View>

              <View style={styles.voltageInputGroup}>
                <Text style={styles.voltageLabel}>Напряжение трубки при обрыве</Text>
                <TextInput
                  style={styles.voltageInput}
                  value={pickupVoltage}
                  onChangeText={setPickupVoltage}
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              <View style={styles.voltageInputGroup}>
                <Text style={styles.voltageLabel}>
                  Напряжение трубки при неисправности
                </Text>
                <TextInput
                  style={styles.voltageInput}
                  value={malfunctionVoltage}
                  onChangeText={setMalfunctionVoltage}
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              <View style={styles.voltageInputGroup}>
                <Text style={styles.voltageLabel}>Напряжение поднятия трубки</Text>
                <TextInput
                  style={styles.voltageInput}
                  value={liftingVoltage}
                  onChangeText={setLiftingVoltage}
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              <View style={styles.voltageInputGroup}>
                <Text style={styles.voltageLabel}>
                  Напряжение открытия двери с трубки
                </Text>
                <TextInput
                  style={styles.voltageInput}
                  value={doorOpenVoltage}
                  onChangeText={setDoorOpenVoltage}
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              <View style={styles.generalLevelsButtons}>
                <TouchableOpacity
                  style={styles.generalLevelsButtonSecondary}
                  onPress={() => setGeneralLevelsModalVisible(false)}>
                  <Text style={styles.generalLevelsButtonSecondaryText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.generalLevelsButtonPrimary}
                  onPress={() => {
                    Alert.alert('Успешно', 'Общие уровни трубок обновлены');
                    setGeneralLevelsModalVisible(false);
                  }}>
                  <Text style={styles.generalLevelsButtonPrimaryText}>Обновить</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Модальное окно меню ключей */}
      <Modal
        visible={keysMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setKeysMenuVisible(false)}>
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setKeysMenuVisible(false)}>
          <View style={styles.keysMenuContent}>
            <TouchableOpacity
              style={styles.keysMenuItem}
              onPress={() => {
                setKeysMenuVisible(false);
                Alert.alert('Информация', 'Функция добавления файла CSV');
              }}>
              <Icon name="upload-file" size={20} color="#5B9FED" />
              <Text style={styles.keysMenuItemText}>Добавить файл CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keysMenuItem}
              onPress={() => {
                setKeysMenuVisible(false);
                Alert.alert('Информация', 'Функция скачивания файла CSV');
              }}>
              <Icon name="download" size={20} color="#5B9FED" />
              <Text style={styles.keysMenuItemText}>Скачать файл CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keysMenuItem}
              onPress={() => {
                setKeysMenuVisible(false);
                setKeysManagementModalVisible(true);
              }}>
              <Icon name="settings" size={20} color="#5B9FED" />
              <Text style={styles.keysMenuItemText}>Управление ключами</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Модальное окно управления ключами */}
      <Modal
        visible={keysManagementModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setKeysManagementModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.keysManagementModal}>
            <View style={styles.keysManagementHeader}>
              <Text style={styles.keysManagementTitle}>Управление ключами</Text>
              <TouchableOpacity onPress={() => setKeysManagementModalVisible(false)}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.keysManagementContent}>
              <View style={styles.keysManagementSetting}>
                <Text style={styles.keysManagementLabel}>
                  Проверка обратного идентификатора
                </Text>
                <Switch
                  value={reverseIdentifierCheck}
                  onValueChange={setReverseIdentifierCheck}
                  trackColor={{false: '#555', true: '#5B9FED'}}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно добавления ключа в настройках квартиры */}
      <Modal
        visible={addKeyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setAddKeyModalVisible(false);
          setScannedKeyId('');
          setKeyName('');
          setNfcReading(false);
          setAddKeyStep('nfc');
          setNfcAttempted(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.addKeyModalContent}>
            <View style={styles.addKeyModalHeader}>
              <Text style={styles.modalTitle}>Добавить ключ</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddKeyModalVisible(false);
                  setScannedKeyId('');
                  setKeyName('');
                  setNfcReading(false);
                  setAddKeyStep('nfc');
                  setNfcAttempted(false);
                }}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.addKeyModalBody}
              contentContainerStyle={styles.addKeyModalBodyContent}>
              {addKeyStep === 'nfc' && (
                <View style={styles.nfcContainer}>
                  <Icon
                    name="nfc"
                    size={80}
                    color={nfcReading ? '#5B9FED' : '#ccc'}
                  />
                  <Text style={styles.nfcTitle}>
                    {nfcReading ? 'Приложите ключ к телефону' : 'Ожидание считывания...'}
                  </Text>
                  {nfcReading && (
                    <Text style={styles.nfcSubtitle}>
                      Убедитесь, что NFC включён на телефоне
                    </Text>
                  )}
                  {!nfcReading && scannedKeyId && (
                    <Text style={styles.scannedKeyId}>
                      Считано: {scannedKeyId}
                    </Text>
                  )}
                  {!nfcReading && !scannedKeyId && nfcAttempted && (
                    <>
                      <Text style={styles.errorText}>
                        Не удалось считать ключ. Попробуйте еще раз.
                      </Text>
                      <TouchableOpacity
                        style={styles.retryNFCButton}
                        onPress={startNFCScanForApartment}>
                        <Icon name="refresh" size={20} color="#5B9FED" />
                        <Text style={styles.retryNFCButtonText}>Повторить считывание</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {!nfcReading && !scannedKeyId && !nfcAttempted && (
                    <TouchableOpacity
                      style={styles.startNFCButton}
                      onPress={startNFCScanForApartment}>
                      <Icon name="nfc" size={24} color="#5B9FED" />
                      <Text style={styles.startNFCButtonText}>Начать считывание</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {addKeyStep === 'name' && (
                <>
                  <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => {
                        setAddKeyStep('nfc');
                        setScannedKeyId('');
                        setNfcAttempted(false);
                      }}>
                      <Icon name="arrow-back" size={20} color="#5B9FED" />
                      <Text style={styles.backButtonText}>Назад</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.stepTitle}>Введите имя ключа</Text>
                  <Text style={styles.stepSubtitle}>
                    Например: "Ключ мамы", "Ключ уборщицы"
                  </Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Имя ключа"
                    placeholderTextColor="#999"
                    value={keyName}
                    onChangeText={setKeyName}
                    autoFocus={true}
                  />
                  <Text style={styles.inputHint}>
                    Идентификатор: {scannedKeyId}
                  </Text>
                </>
              )}
            </ScrollView>
            {addKeyStep === 'name' && (
              <View style={styles.addKeyModalFooter}>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleSaveApartmentKey}>
                  <Text style={styles.modalSaveButtonText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
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
  scrollContent: {
    paddingBottom: 48,
  },
  settingsScrollContent: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  controlsContainer: {
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B9FED',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#000',
  },
  apartmentListContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  apartmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  apartmentCardLast: {
    borderBottomWidth: 0,
  },
  apartmentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  apartmentNumber: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginLeft: 12,
  },
  apartmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pageButtonActive: {
    backgroundColor: '#5B9FED',
    borderColor: '#5B9FED',
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  },
  pageButtonTextActive: {
    color: '#fff',
  },
  pageEllipsis: {
    fontSize: 15,
    color: '#666',
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#5B9FED',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 15,
    color: '#000',
    marginLeft: 12,
  },
  menuItemTextDanger: {
    color: '#F44336',
  },
  settingsModal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  tabNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabArrow: {
    padding: 8,
  },
  tabIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCurrentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  tabCounter: {
    fontSize: 12,
    color: '#999',
  },
  settingsContent: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 15,
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  testCallDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  testCallDropdownText: {
    fontSize: 15,
    color: '#000',
    flex: 1,
  },
  testCallDropdownTextPlaceholder: {
    color: '#999',
  },
  testCallDropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testCallDropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  testCallDropdownItemLast: {
    borderBottomWidth: 0,
  },
  testCallDropdownItemText: {
    fontSize: 15,
    color: '#000',
    flex: 1,
  },
  testButton: {
    backgroundColor: '#5B9FED',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  endCallButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  endCallButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  addCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B9FED',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addCodeButtonText: {
    color: '#5B9FED',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  addCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  confirmCodeButton: {
    backgroundColor: '#5B9FED',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelCodeButton: {
    backgroundColor: '#f5f5f5',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sipNumberItem: {
    marginBottom: 12,
  },
  sipInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingRight: 8,
  },
  sipInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 12,
    marginBottom: 0,
  },
  deleteSipButton: {
    padding: 8,
    marginLeft: 4,
  },
  addSipContainer: {
    marginBottom: 12,
  },
  confirmSipButton: {
    backgroundColor: '#5B9FED',
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  cancelSipButton: {
    backgroundColor: 'transparent',
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sliderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  sliderMode: {
    fontSize: 12,
    color: '#5B9FED',
    marginLeft: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 14,
    color: '#fff',
    minWidth: 30,
  },
  slider: {
    flex: 1,
    marginLeft: 12,
  },
  keysList: {
    marginTop: 12,
  },
  keyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  keyText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'monospace',
  },
  keyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  deleteAllText: {
    color: '#F44336',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  addMoreButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B9FED',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addMoreText: {
    color: '#5B9FED',
    fontSize: 15,
    fontWeight: '600',
  },
  diagnosticItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  diagnosticLabel: {
    fontSize: 15,
    color: '#000',
    flex: 1,
  },
  diagnosticInput: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    fontSize: 15,
    color: '#000',
    minWidth: 60,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  diagnosticValue: {
    fontSize: 14,
    color: '#999',
  },
  diagnosticButton: {
    backgroundColor: '#5B9FED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  diagnosticButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  settingsFooter: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B9FED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#5B9FED',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    marginBottom: 12,
  },
  generalLevelsModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  generalLevelsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  generalLevelsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  generalLevelsContent: {
    padding: 16,
    maxHeight: 500,
  },
  generalLevelsContentStyle: {
    paddingBottom: 20,
  },
  generalLevelsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  voltageInputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  voltageLabel: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  voltageInput: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
    color: '#000',
    minWidth: 60,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  generalLevelsButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  generalLevelsButtonSecondary: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  generalLevelsButtonSecondaryText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  generalLevelsButtonPrimary: {
    flex: 1,
    backgroundColor: '#5B9FED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  generalLevelsButtonPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  keysMenuContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  keysMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  keysMenuItemText: {
    fontSize: 15,
    color: '#000',
    marginLeft: 12,
  },
  keysManagementModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  keysManagementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  keysManagementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  keysManagementContent: {
    padding: 20,
  },
  keysManagementSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  keysManagementLabel: {
    fontSize: 15,
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  addKeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B9FED',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addKeyButtonText: {
    color: '#5B9FED',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  addKeyModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  addKeyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addKeyModalBody: {
    padding: 20,
    maxHeight: 400,
    flexGrow: 1,
  },
  addKeyModalBodyContent: {
    paddingBottom: 20,
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addKeyModalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  modalSaveButton: {
    backgroundColor: '#5B9FED',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  backButtonContainer: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5B9FED',
    marginLeft: 8,
  },
  nfcContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 300,
  },
  nfcTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },
  nfcSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  scannedKeyId: {
    fontSize: 14,
    color: '#5B9FED',
    marginTop: 20,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  retryNFCButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B9FED',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryNFCButtonText: {
    color: '#5B9FED',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    marginTop: 20,
    textAlign: 'center',
  },
  startNFCButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  startNFCButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ApartmentsScreen;
