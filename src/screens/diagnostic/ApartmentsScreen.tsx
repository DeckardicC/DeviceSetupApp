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

  const [apartments, setApartments] = useState<Apartment[]>(generateApartments());
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [generalLevelsModalVisible, setGeneralLevelsModalVisible] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [newApartmentNumber, setNewApartmentNumber] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<SettingsTab>('basic');
  const itemsPerPage = 20;

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

  const handleAddApartment = () => {
    setEditingApartment(null);
    setNewApartmentNumber('');
    setModalVisible(true);
  };

  const handleEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setNewApartmentNumber(apartment.number);
    setModalVisible(true);
  };

  const handleOpenSettings = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setActiveTab('basic');
    setSettingsModalVisible(true);
  };

  const handleDeleteApartment = (id: string) => {
    Alert.alert(
      'Удалить квартиру',
      'Вы уверены, что хотите удалить эту квартиру?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Удалить',
          onPress: () => {
            const updatedApartments = apartments.filter(apt => apt.id !== id);
            setApartments(updatedApartments);
            if (currentApartments.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const handleSaveApartment = () => {
    if (!newApartmentNumber.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите номер квартиры.');
      return;
    }
    if (
      apartments.some(
        apt =>
          apt.number === newApartmentNumber &&
          (!editingApartment || apt.id !== editingApartment.id),
      )
    ) {
      Alert.alert('Ошибка', 'Квартира с таким номером уже существует.');
      return;
    }

    if (editingApartment) {
      setApartments(
        apartments.map(apt =>
          apt.id === editingApartment.id
            ? {...apt, number: newApartmentNumber}
            : apt,
        ),
      );
    } else {
      const newId = String(
        apartments.length > 0
          ? Math.max(...apartments.map(a => Number(a.id))) + 1
          : 1,
      );
      setApartments([...apartments, {id: newId, number: newApartmentNumber}]);
    }
    setModalVisible(false);
    setNewApartmentNumber('');
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

  const handleDeleteAllApartments = () => {
    setMenuModalVisible(false);
    Alert.alert(
      'Удалить все квартиры',
      'Вы действительно хотите удалить все квартиры? Это действие нельзя отменить.',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Удалить все',
          onPress: () => {
            setApartments([]);
            setCurrentPage(1);
            Alert.alert('Успешно', 'Все квартиры удалены');
          },
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
          <ScrollView style={styles.settingsContent}>
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
              <TextInput style={styles.input} placeholder="Тестовый вызов" />
              <TouchableOpacity style={styles.testButton}>
                <Text style={styles.testButtonText}>Тестовый звонок</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'audio':
        return (
          <ScrollView style={styles.settingsContent}>
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
          <ScrollView style={styles.settingsContent}>
            <Text style={styles.inputLabel}>Добавить ключ *</Text>
            <Text style={styles.hint}>
              От 8 до 14 символов в 16-ой системе исчисления
            </Text>
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
          <ScrollView style={styles.settingsContent}>
            <Text style={styles.inputLabel}>Добавить код *</Text>
            <Text style={styles.hint}>Код должен состоять из 5 цифр</Text>
            <View style={styles.keysList}>
              <View style={styles.keyItem}>
                <Text style={styles.keyText}>10880</Text>
                <TouchableOpacity>
                  <Icon name="delete-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
              <View style={styles.keyItem}>
                <Text style={styles.keyText}>91885</Text>
                <TouchableOpacity>
                  <Icon name="delete-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteAllButton}>
              <Icon name="delete-sweep" size={20} color="#F44336" />
              <Text style={styles.deleteAllText}>Удалить все коды</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      case 'sip':
        return (
          <ScrollView style={styles.settingsContent}>
            <Text style={styles.inputLabel}>SIP-номер *</Text>
            <TextInput style={styles.input} value="1" />
            <Text style={styles.hint}>Осталось символов для ввода: 29</Text>
            <TouchableOpacity style={styles.addMoreButton}>
              <Text style={styles.addMoreText}>Добавить еще</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      case 'diagnostic':
        return (
          <ScrollView style={styles.settingsContent}>
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

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Управление квартирами</Text>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddApartment}>
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Добавить квартиру</Text>
          </TouchableOpacity>

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
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditApartment(apt)}>
                  <Icon name="edit" size={22} color="#5B9FED" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteApartment(apt.id)}>
                  <Icon name="delete-outline" size={22} color="#F44336" />
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

      {/* Модальное окно добавления/редактирования */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingApartment ? 'Редактировать квартиру' : 'Добавить квартиру'}
            </Text>

            <Text style={styles.inputLabel}>Номер квартиры</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите номер квартиры"
              placeholderTextColor="#999"
              value={newApartmentNumber}
              onChangeText={setNewApartmentNumber}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveApartment}>
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteAllApartments}>
              <Icon name="delete-sweep" size={20} color="#F44336" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                Удалить все квартиры
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

            <ScrollView style={styles.generalLevelsContent}>
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
  testButton: {
    backgroundColor: '#5B9FED',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
});

export default ApartmentsScreen;
