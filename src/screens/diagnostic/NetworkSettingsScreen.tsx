import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface NetworkAddress {
  id: string;
  type: 'dynamic' | 'static';
  ip: string;
  mask: string;
  gateway: string;
  dns1: string;
  dns2: string;
}

const NetworkSettingsScreen = ({navigation}: any) => {
  const [addresses, setAddresses] = useState<NetworkAddress[]>([
    {
      id: '1',
      type: 'static',
      ip: '10.207.249.132',
      mask: '255.255.255.24',
      gateway: '10.207.249.125',
      dns1: '212.75.210.62',
      dns2: '',
    },
    {
      id: '2',
      type: 'static',
      ip: '192.168.0.100',
      mask: '255.255.255.0',
      gateway: '192.168.0.1',
      dns1: '192.168.0.1',
      dns2: '',
    },
  ]);

  const handleAddInterface = () => {
    const newId = (addresses.length + 1).toString();
    const newAddress: NetworkAddress = {
      id: newId,
      type: 'dynamic',
      ip: '',
      mask: '',
      gateway: '',
      dns1: '',
      dns2: '',
    };
    setAddresses([...addresses, newAddress]);
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      Alert.alert('Ошибка', 'Нельзя удалить единственный сетевой адрес');
      return;
    }
    Alert.alert(
      'Удалить сетевой адрес',
      'Вы уверены, что хотите удалить этот сетевой адрес?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => setAddresses(addresses.filter(addr => addr.id !== id)),
        },
      ],
    );
  };

  const handleTypeChange = (id: string, type: 'dynamic' | 'static') => {
    setAddresses(
      addresses.map(addr =>
        addr.id === id
          ? {
              ...addr,
              type,
              // Очищаем поля при переключении на динамический
              ...(type === 'dynamic'
                ? {ip: '', mask: '', gateway: '', dns1: '', dns2: ''}
                : {}),
            }
          : addr,
      ),
    );
  };

  const handleFieldChange = (
    id: string,
    field: keyof NetworkAddress,
    value: string,
  ) => {
    setAddresses(
      addresses.map(addr => (addr.id === id ? {...addr, [field]: value} : addr)),
    );
  };

  const handleSave = () => {
    // Валидация
    for (const addr of addresses) {
      if (addr.type === 'static') {
        if (!addr.ip || !addr.mask || !addr.gateway || !addr.dns1) {
          Alert.alert(
            'Ошибка',
            `Заполните все обязательные поля для сетевого адреса №${addr.id}`,
          );
          return;
        }
      }
    }
    Alert.alert('Успешно', 'Настройки сети сохранены');
  };

  const renderNetworkAddress = (address: NetworkAddress, index: number) => {
    const isDynamic = address.type === 'dynamic';

    return (
      <View key={address.id} style={styles.addressCard}>
        {/* Заголовок */}
        <View style={styles.addressHeader}>
          <Text style={styles.addressTitle}>Сетевой адрес №{index + 1}</Text>
          {addresses.length > 1 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteAddress(address.id)}>
              <Icon name="delete-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>

        {/* Переключатель типа */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              isDynamic && styles.typeButtonActive,
              !isDynamic && styles.typeButtonInactive,
            ]}
            onPress={() => handleTypeChange(address.id, 'dynamic')}>
            <View
              style={[
                styles.radio,
                isDynamic && styles.radioActive,
              ]}
            />
            <Text
              style={[
                styles.typeButtonText,
                isDynamic && styles.typeButtonTextActive,
              ]}>
              Динамический
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              !isDynamic && styles.typeButtonActive,
              isDynamic && styles.typeButtonInactive,
            ]}
            onPress={() => handleTypeChange(address.id, 'static')}>
            <View
              style={[
                styles.radio,
                !isDynamic && styles.radioActive,
              ]}
            />
            <Text
              style={[
                styles.typeButtonText,
                !isDynamic && styles.typeButtonTextActive,
              ]}>
              Статический
            </Text>
          </TouchableOpacity>
        </View>

        {/* Предупреждение для статического */}
        {!isDynamic && (
          <View style={styles.warningBox}>
            <Icon name="info" size={20} color="#856404" />
            <Text style={styles.warningText}>
              Панель оснащена двумя сетевыми адресами: динамическим и статическим
              (192.168.0.100). Первый служит для автоматического получения IP-адреса
              посредством протокола DHCP-когда как второй предназначен для прямого
              соединения панели с компьютером. Обратите внимание, что стандартный
              статический адрес (192.168.0.100) присваивается всем панелям изначально.
              Если вы предпочитаете использовать статический IP-адрес как основной, то
              советуем его заменить. Если же вы не собираетесь его использовать,
              рекомендуем удалить.
            </Text>
          </View>
        )}

        {/* Поля ввода */}
        {!isDynamic && (
          <View style={styles.fieldsContainer}>
            <View style={styles.fieldRow}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>IP-адрес *</Text>
                <TextInput
                  style={styles.input}
                  value={address.ip}
                  onChangeText={value =>
                    handleFieldChange(address.id, 'ip', value)
                  }
                  placeholder="10.207.249.132"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Маска *</Text>
                <TextInput
                  style={styles.input}
                  value={address.mask}
                  onChangeText={value =>
                    handleFieldChange(address.id, 'mask', value)
                  }
                  placeholder="255.255.255.24"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Шлюз *</Text>
                <TextInput
                  style={styles.input}
                  value={address.gateway}
                  onChangeText={value =>
                    handleFieldChange(address.id, 'gateway', value)
                  }
                  placeholder="10.207.249.125"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>DNS-сервер 1 *</Text>
                <TextInput
                  style={styles.input}
                  value={address.dns1}
                  onChangeText={value =>
                    handleFieldChange(address.id, 'dns1', value)
                  }
                  placeholder="212.75.210.62"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DNS-сервер 2</Text>
              <TextInput
                style={styles.input}
                value={address.dns2}
                onChangeText={value =>
                  handleFieldChange(address.id, 'dns2', value)
                }
                placeholder="Опционально"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={true}
                selectTextOnFocus={true}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройка сети</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddInterface}>
          <Icon name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Добавить интерфейс</Text>
        </TouchableOpacity>

        {addresses.map((address, index) => renderNetworkAddress(address, index))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
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
    paddingBottom: 48,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B9FED',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  deleteButton: {
    padding: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  typeButtonActive: {
    borderColor: '#5B9FED',
    backgroundColor: '#EBF5FF',
  },
  typeButtonInactive: {
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
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
  typeButtonText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#5B9FED',
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
    lineHeight: 18,
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldGroup: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
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
  saveButton: {
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NetworkSettingsScreen;

