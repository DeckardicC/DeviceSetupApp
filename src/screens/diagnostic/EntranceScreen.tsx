import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EntranceScreen = ({navigation}: any) => {
  const [doorsAlwaysOpen, setDoorsAlwaysOpen] = useState(false);
  const [doorsOpenOnNetworkFailure, setDoorsOpenOnNetworkFailure] =
    useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Вход</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Настройка входа</Text>

        {/* Общие настройки */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Общие настройки</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>
                Режим «Двери постоянно открыты»
              </Text>
              <Text style={styles.settingDescription}>
                Входные двери всегда открыты
              </Text>
            </View>
            <Switch
              value={doorsAlwaysOpen}
              onValueChange={setDoorsAlwaysOpen}
              trackColor={{false: '#ccc', true: '#5B9FED'}}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>
                Режим «Двери постоянно открыты при недоступности сети»
              </Text>
              <Text style={styles.settingDescription}>
                Открывать двери при потере связи с сетью
              </Text>
            </View>
            <Switch
              value={doorsOpenOnNetworkFailure}
              onValueChange={setDoorsOpenOnNetworkFailure}
              trackColor={{false: '#ccc', true: '#5B9FED'}}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Icon name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Сохранить изменения</Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default EntranceScreen;

