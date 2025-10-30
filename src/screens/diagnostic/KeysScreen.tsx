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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Key {
  id: string;
  apartment: string;
  identifier: string;
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

  const filteredKeys = keys.filter(key => {
    if (!searchText) return true;
    if (searchByApartment) {
      return key.apartment.toLowerCase().includes(searchText.toLowerCase());
    }
    return key.identifier.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleAddKey = () => {
    setEditingKey(null);
    setNewApartment('');
    setNewIdentifier('');
    setModalVisible(true);
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
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
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

      {/* Модальное окно для добавления/редактирования */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingKey ? 'Редактировать ключ' : 'Добавить ключ'}
            </Text>

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
});

export default KeysScreen;

