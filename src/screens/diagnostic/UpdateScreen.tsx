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
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const UpdateScreen = ({navigation}: any) => {
  const [updateMethod, setUpdateMethod] = useState<'HTTP' | 'FTP'>('HTTP');
  const [serverPath, setServerPath] = useState('');
  const [fileName, setFileName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [advancedExpanded, setAdvancedExpanded] = useState(false);

  const currentVersion = '2.5.0.12.8';

  const handleUpdate = () => {
    if (!serverPath || !fileName) {
      Alert.alert('Ошибка', 'Заполните путь до папки и название файла');
      return;
    }
    if (updateMethod === 'FTP' && (!login || !password)) {
      Alert.alert('Ошибка', 'Для FTP требуется логин и пароль');
      return;
    }
    Alert.alert(
      'Обновить устройство',
      'Вы уверены, что хотите начать обновление прошивки?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Обновить',
          onPress: () => {
            Alert.alert('Обновление', 'Начато обновление устройства...');
          },
        },
      ],
    );
  };

  const toggleAdvanced = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAdvancedExpanded(!advancedExpanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Обновление устройства</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        {/* Текущая версия */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionLabel}>Текущая версия прошивки:</Text>
          <Text style={styles.versionValue}>{currentVersion}</Text>
        </View>

        {/* Метод обновления */}
        <View style={styles.methodSelector}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              styles.methodButtonLeft,
              updateMethod === 'HTTP' && styles.methodButtonActive,
            ]}
            onPress={() => setUpdateMethod('HTTP')}>
            {updateMethod === 'HTTP' && (
              <Icon name="check" size={18} color="#fff" style={styles.checkIcon} />
            )}
            <Text
              style={[
                styles.methodButtonText,
                updateMethod === 'HTTP' && styles.methodButtonTextActive,
              ]}>
              По HTTP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodButton,
              styles.methodButtonRight,
              updateMethod === 'FTP' && styles.methodButtonActive,
            ]}
            onPress={() => setUpdateMethod('FTP')}>
            {updateMethod === 'FTP' && (
              <Icon name="check" size={18} color="#fff" style={styles.checkIcon} />
            )}
            <Text
              style={[
                styles.methodButtonText,
                updateMethod === 'FTP' && styles.methodButtonTextActive,
              ]}>
              По FTP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Форма */}
        <View style={styles.formContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Путь до папки с файлами на сервере *
              </Text>
              <TextInput
                style={styles.input}
                value={serverPath}
                onChangeText={setServerPath}
                placeholder="http://server/path/to/file"
                placeholderTextColor="#666"
              />
              <Text style={styles.hint}>
                Шаблон:{' '}
                {updateMethod === 'HTTP'
                  ? 'http://server/path/to/file'
                  : 'ftp://server-port/path/to/file'}
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Название файла *</Text>
              <TextInput
                style={styles.input}
                value={fileName}
                onChangeText={setFileName}
                placeholder="firmware.isoam"
                placeholderTextColor="#666"
              />
              <Text style={styles.hint}>Файл в формате .isoam</Text>
            </View>
          </View>

          {updateMethod === 'FTP' && (
            <View style={styles.fieldRow}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Логин *</Text>
                <TextInput
                  style={styles.input}
                  value={login}
                  onChangeText={setLogin}
                  placeholder="Введите логин"
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Пароль *</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Введите пароль"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>
            </View>
          )}
        </View>

        {/* Расширенные настройки */}
        <TouchableOpacity style={styles.advancedHeader} onPress={toggleAdvanced}>
          <Text style={styles.advancedTitle}>Расширенные настройки</Text>
          <Icon
            name={advancedExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        {advancedExpanded && (
          <View style={styles.advancedContent}>
            <Text style={styles.advancedText}>
              Дополнительные параметры обновления будут доступны здесь
            </Text>
          </View>
        )}

        {/* Кнопка обновления */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Icon name="system-update" size={20} color="#fff" />
          <Text style={styles.updateButtonText}>Обновить устройство</Text>
        </TouchableOpacity>

        {/* Информация */}
        <View style={styles.infoBox}>
          <Icon name="info-outline" size={20} color="#5B9FED" />
          <Text style={styles.infoText}>
            Во время обновления устройство будет недоступно. Процесс может занять
            несколько минут. Не выключайте устройство до завершения обновления.
          </Text>
        </View>
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
  versionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  versionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    backgroundColor: '#fff',
  },
  methodButtonLeft: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  methodButtonRight: {},
  methodButtonActive: {
    backgroundColor: '#5B9FED',
  },
  checkIcon: {
    marginRight: 6,
  },
  methodButtonText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldRow: {
    gap: 16,
  },
  fieldGroup: {
    marginBottom: 0,
  },
  fieldLabel: {
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
  advancedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  advancedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  advancedContent: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  advancedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#5B9FED',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1976D2',
    marginLeft: 8,
    lineHeight: 18,
  },
});

export default UpdateScreen;

