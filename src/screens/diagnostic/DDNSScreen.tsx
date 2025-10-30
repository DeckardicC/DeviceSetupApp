import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DDNSScreen = ({navigation}: any) => {
  const [ddnsEnabled, setDdnsEnabled] = useState(false);
  const [interval, setInterval] = useState('300');
  const [port, setPort] = useState('8081');
  const [serverAddress, setServerAddress] = useState('10.199.63.7');
  const [login, setLogin] = useState('default');
  const [password, setPassword] = useState('');
  const [hostname, setHostname] = useState('ddns.ISOam');

  const handleSave = () => {
    console.log('Saving DDNS settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройка DDNS</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          Динамическая система доменных имён
        </Text>

        {/* Включить DDNS */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Включить DDNS</Text>
          <Switch
            value={ddnsEnabled}
            onValueChange={setDdnsEnabled}
            trackColor={{false: '#ccc', true: '#5B9FED'}}
            thumbColor="#fff"
          />
        </View>

        {/* Форма настроек */}
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            {/* Левая колонка */}
            <View style={styles.formColumn}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Интервал отправки запросов (секунды) *
                </Text>
                <TextInput
                  style={styles.input}
                  value={interval}
                  onChangeText={setInterval}
                  keyboardType="numeric"
                  placeholder="300"
                  placeholderTextColor="#666"
                  editable={ddnsEnabled}
                />
                <Text style={styles.hint}>Ограничение от 1 до 65535</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Порт сервера *</Text>
                <TextInput
                  style={styles.input}
                  value={port}
                  onChangeText={setPort}
                  keyboardType="numeric"
                  placeholder="8081"
                  placeholderTextColor="#666"
                  editable={ddnsEnabled}
                />
                <Text style={styles.hint}>Ограничение от 1 до 65535</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Адрес сервера *</Text>
                <TextInput
                  style={styles.input}
                  value={serverAddress}
                  onChangeText={setServerAddress}
                  placeholder="10.199.63.7"
                  placeholderTextColor="#666"
                  editable={ddnsEnabled}
                />
                <Text style={styles.hint}>Количество символов для ввода: 117</Text>
              </View>
            </View>

            {/* Правая колонка */}
            <View style={styles.formColumn}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Логин *</Text>
                <TextInput
                  style={styles.input}
                  value={login}
                  onChangeText={setLogin}
                  placeholder="default"
                  placeholderTextColor="#666"
                  editable={ddnsEnabled}
                />
                <Text style={styles.hint}>Количество символов для ввода: 121</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Пароль *</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="******"
                  placeholderTextColor="#666"
                  secureTextEntry
                  editable={ddnsEnabled}
                />
                <Text style={styles.hint}>Количество символов для ввода: 121</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Дополнительное поле (hostname) *
                </Text>
                <TextInput
                  style={styles.input}
                  value={hostname}
                  onChangeText={setHostname}
                  placeholder="ddns.ISOam"
                  placeholderTextColor="#666"
                  editable={ddnsEnabled}
                />
                <Text style={styles.hint}>Количество символов для ввода: 118</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !ddnsEnabled && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!ddnsEnabled}>
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
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formRow: {
    flexDirection: 'column',
    gap: 0,
  },
  formColumn: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    color: '#999',
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
    color: '#999',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DDNSScreen;

