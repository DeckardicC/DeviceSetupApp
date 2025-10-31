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
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Key {
  id: string;
  apartment: string;
  identifier: string;
  name?: string;
}

const KeysScreen = ({navigation}: any) => {
  const [keys, setKeys] = useState<Key[]>([
    {id: '1', apartment: '3', identifier: '00000030F5304E'},
    {id: '2', apartment: '3', identifier: '0000030F5304D1'},
    {id: '3', apartment: '3', identifier: '0000030F5304D3'},
    {id: '4', apartment: '1', identifier: '0000043A6B9C1'},
    {id: '5', apartment: 'Общий', identifier: '0000001DA5F2AB'},
    {id: '6', apartment: '57', identifier: '0000000B1D2E1D'},
    {id: '7', apartment: 'Общий', identifier: '0000030F5304D5'},
    {id: '8', apartment: '2', identifier: '0000030F5301D1'},
  ]);

  const [searchByApartment, setSearchByApartment] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<Key | null>(null);
  const [newApartment, setNewApartment] = useState('');
  const [newIdentifier, setNewIdentifier] = useState('');
  
  // Состояние для меню ключей
  const [keysMenuVisible, setKeysMenuVisible] = useState(false);
  const [keysManagementModalVisible, setKeysManagementModalVisible] = useState(false);
  const [reverseIdentifierCheck, setReverseIdentifierCheck] = useState(true);

  // Состояние для процесса добавления нового ключа
  const [addKeyStep, setAddKeyStep] = useState<'select' | 'entrance' | 'apartment' | 'nfc' | 'name'>('select');
  const [addKeyModalVisible, setAddKeyModalVisible] = useState(false);
  const [selectedEntrance, setSelectedEntrance] = useState('');
  const [selectedApartmentNumber, setSelectedApartmentNumber] = useState('');
  const [nfcReading, setNfcReading] = useState(false);
  const [scannedKeyId, setScannedKeyId] = useState('');
  const [keyName, setKeyName] = useState('');
  const [nfcAttempted, setNfcAttempted] = useState(false);
  
  // Моковые данные для подъездов и квартир
  const entrances = ['Подъезд 1', 'Подъезд 2', 'Подъезд 3', 'Подъезд 4'];
  const apartments = Array.from({length: 100}, (_, i) => (i + 1).toString());

  const filteredKeys = keys.filter(key => {
    if (!searchText) return true;
    if (searchByApartment) {
      return key.apartment.toLowerCase().includes(searchText.toLowerCase());
    }
    return key.identifier.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleAddKey = () => {
    setAddKeyStep('entrance');
    setAddKeyModalVisible(true);
    setSelectedEntrance('');
    setSelectedApartmentNumber('');
    setScannedKeyId('');
    setKeyName('');
    setNfcReading(false);
    setNfcAttempted(false);
  };

  const handleEntranceSelect = (entrance: string) => {
    setSelectedEntrance(entrance);
    setAddKeyStep('apartment');
  };

  const handleApartmentSelect = (apartment: string) => {
    setSelectedApartmentNumber(apartment);
    setAddKeyStep('nfc');
    setNfcAttempted(false);
    setScannedKeyId('');
    setNfcReading(false);
  };

  const startNFCScan = () => {
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

  const handleSaveNewKey = () => {
    if (!keyName.trim()) {
      Alert.alert('Ошибка', 'Введите имя ключа');
      return;
    }

    if (!scannedKeyId) {
      Alert.alert('Ошибка', 'Не удалось считать ключ');
      return;
    }

    // Проверка, не занят ли ключ
    const keyExists = keys.some(k => k.identifier === scannedKeyId);
    if (keyExists) {
      Alert.alert(
        'Ошибка',
        'Ключ уже привязан к другому адресу. Для повторного использования удалите его из текущей привязки.',
      );
      return;
    }

    const newKey: Key = {
      id: Date.now().toString(),
      apartment: selectedApartmentNumber,
      identifier: scannedKeyId,
      name: keyName,
    };
    setKeys([...keys, newKey]);
    Alert.alert('Успешно', 'Ключ успешно добавлен');
    setAddKeyModalVisible(false);
    resetAddKeyState();
  };

  const resetAddKeyState = () => {
    setAddKeyStep('select');
    setSelectedEntrance('');
    setSelectedApartmentNumber('');
    setScannedKeyId('');
    setKeyName('');
    setNfcReading(false);
    setNfcAttempted(false);
  };

  const handleEditKey = (key: Key) => {
    setEditingKey(key);
    setNewApartment(key.apartment);
    setNewIdentifier(key.identifier);
    setModalVisible(true);
  };

  const handleDeleteKey = (keyId: string) => {
    Alert.alert(
      'Удаление ключа',
      'Вы уверены, что хотите удалить этот ключ?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setKeys(keys.filter(k => k.id !== keyId));
          },
        },
      ],
    );
  };

  const handleSaveKey = () => {
    if (!newApartment.trim() || !newIdentifier.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    if (editingKey) {
      // Редактирование
      setKeys(
        keys.map(k =>
          k.id === editingKey.id
            ? {...k, apartment: newApartment, identifier: newIdentifier}
            : k,
        ),
      );
    } else {
      // Добавление
      const newKey: Key = {
        id: Date.now().toString(),
        apartment: newApartment,
        identifier: newIdentifier,
      };
      setKeys([...keys, newKey]);
    }

    setModalVisible(false);
    setNewApartment('');
    setNewIdentifier('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ключи</Text>
        <TouchableOpacity onPress={() => setKeysMenuVisible(true)}>
          <Icon name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Управление ключами</Text>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddKey}>
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Добавить ключ</Text>
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={
                searchByApartment
                  ? 'Поиск по квартире'
                  : 'Введите идентификатор ключа'
              }
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              style={styles.searchToggle}
              onPress={() => setSearchByApartment(!searchByApartment)}>
              <Icon
                name={searchByApartment ? 'apartment' : 'vpn-key'}
                size={20}
                color="#666"
              />
              <Text style={styles.searchToggleText}>
                Поиск по {searchByApartment ? 'квартире' : 'ключу'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableContainer}>
          {filteredKeys.map((key, index) => (
            <View
              key={key.id}
              style={[
                styles.keyCard,
                index === filteredKeys.length - 1 && styles.keyCardLast,
              ]}>
              <View style={styles.keyCardLeft}>
                <Text style={styles.keyApartment}>Квартира {key.apartment}</Text>
                <Text style={styles.keyIdentifier}>{key.identifier}</Text>
              </View>
              <View style={styles.keyActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditKey(key)}>
                  <Icon name="edit" size={22} color="#5B9FED" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteKey(key.id)}>
                  <Icon name="delete-outline" size={22} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {filteredKeys.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="vpn-key" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Ключи не найдены</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Модальное окно для редактирования */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать ключ</Text>

            <Text style={styles.inputLabel}>Квартира</Text>
            <TextInput
              style={styles.input}
              placeholder="Номер квартиры или 'Общий'"
              placeholderTextColor="#999"
              value={newApartment}
              onChangeText={setNewApartment}
            />

            <Text style={styles.inputLabel}>Идентификатор ключа</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите идентификатор"
              placeholderTextColor="#999"
              value={newIdentifier}
              onChangeText={setNewIdentifier}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveKey}>
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно для добавления нового ключа */}
      <Modal
        visible={addKeyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setAddKeyModalVisible(false);
          resetAddKeyState();
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.addKeyModalContent}>
            <View style={styles.addKeyModalHeader}>
              <Text style={styles.modalTitle}>Добавить ключ</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddKeyModalVisible(false);
                  resetAddKeyState();
                }}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.addKeyModalBody}
              contentContainerStyle={styles.addKeyModalBodyContent}>
              {addKeyStep === 'entrance' && (
                <>
                  <Text style={styles.stepTitle}>Выберите подъезд</Text>
                  <View style={styles.optionList}>
                    {entrances.map((entrance, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionItem,
                          index === entrances.length - 1 && styles.optionItemLast,
                        ]}
                        onPress={() => handleEntranceSelect(entrance)}>
                        <Text style={styles.optionText}>{entrance}</Text>
                        <Icon name="chevron-right" size={20} color="#666" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {addKeyStep === 'apartment' && (
                <>
                  <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setAddKeyStep('entrance')}>
                      <Icon name="arrow-back" size={20} color="#5B9FED" />
                      <Text style={styles.backButtonText}>Назад</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.stepTitle}>Выберите квартиру</Text>
                  <View style={styles.optionList}>
                    {apartments.map((apt, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionItem,
                          index === apartments.length - 1 && styles.optionItemLast,
                        ]}
                        onPress={() => handleApartmentSelect(apt)}>
                        <Text style={styles.optionText}>Квартира {apt}</Text>
                        <Icon name="chevron-right" size={20} color="#666" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {addKeyStep === 'nfc' && (
                <>
                  <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => {
                        setAddKeyStep('apartment');
                        setNfcReading(false);
                        setScannedKeyId('');
                      }}>
                      <Icon name="arrow-back" size={20} color="#5B9FED" />
                      <Text style={styles.backButtonText}>Назад</Text>
                    </TouchableOpacity>
                  </View>
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
                          onPress={startNFCScan}>
                          <Icon name="refresh" size={20} color="#5B9FED" />
                          <Text style={styles.retryNFCButtonText}>Повторить считывание</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {!nfcReading && !scannedKeyId && !nfcAttempted && (
                      <TouchableOpacity
                        style={styles.startNFCButton}
                        onPress={startNFCScan}>
                        <Icon name="nfc" size={24} color="#5B9FED" />
                        <Text style={styles.startNFCButtonText}>Начать считывание</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}

              {addKeyStep === 'name' && (
                <>
                  <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => {
                        setAddKeyStep('nfc');
                        setScannedKeyId('');
                        startNFCScan();
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
                  onPress={handleSaveNewKey}>
                  <Text style={styles.modalSaveButtonText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            )}
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
                <Icon name="close" size={24} color="#000" />
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
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchInput: {
    padding: 14,
    fontSize: 15,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  searchToggleText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  keyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  keyCardLast: {
    borderBottomWidth: 0,
  },
  keyCardLeft: {
    flex: 1,
  },
  keyApartment: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  keyIdentifier: {
    fontSize: 14,
    color: '#666',
  },
  keyActions: {
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
    fontSize: 16,
    color: '#999',
    marginTop: 12,
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
    padding: 24,
    width: '100%',
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
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#5B9FED',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  optionList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
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
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});

export default KeysScreen;

