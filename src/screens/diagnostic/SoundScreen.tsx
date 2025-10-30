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
import Slider from '@react-native-community/slider';

const SoundScreen = ({navigation}: any) => {
  // Системные звуки
  const [systemVolume, setSystemVolume] = useState(5);
  const [doorSounds, setDoorSounds] = useState(true);

  // Аналоговые трубки
  const [analogRingtoneVolume, setAnalogRingtoneVolume] = useState(1);
  const [analogConversationVolume, setAnalogConversationVolume] = useState(1);
  const [analogPanelVolume, setAnalogPanelVolume] = useState(2);

  // SIP
  const [sipMicGain, setSipMicGain] = useState(19);
  const [sipPanelVolume, setSipPanelVolume] = useState(14);
  const [sipGateVolume, setSipGateVolume] = useState(5);

  const handleSave = () => {
    console.log('Saving sound settings');
  };

  const renderSlider = (
    label: string,
    value: number,
    setValue: (value: number) => void,
    min: number = 0,
    max: number = 16,
  ) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={styles.sliderValueBadge}>
          <Text style={styles.sliderValue}>{Math.round(value)}</Text>
        </View>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor="#5B9FED"
        maximumTrackTintColor="#E0E0E0"
        thumbTintColor="#5B9FED"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Звук</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Общие настройки звука</Text>

        {/* Системные звуки */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Системные звуки клавиш и мелодий вызова панели
          </Text>

          {renderSlider('Громкость', systemVolume, setSystemVolume)}

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              Звуки открытия/запрета открытия двери
            </Text>
            <Switch
              value={doorSounds}
              onValueChange={setDoorSounds}
              trackColor={{false: '#ccc', true: '#5B9FED'}}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Вызовы в аналоговые трубки */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Вызовы в аналоговые трубки</Text>

          {renderSlider(
            'Громкость мелодии трубки',
            analogRingtoneVolume,
            setAnalogRingtoneVolume,
          )}

          <View style={styles.divider} />

          {renderSlider(
            'Громкость разговора в трубке',
            analogConversationVolume,
            setAnalogConversationVolume,
          )}

          <View style={styles.divider} />

          {renderSlider(
            'Громкость разговора на панели',
            analogPanelVolume,
            setAnalogPanelVolume,
          )}
        </View>

        {/* Вызовы в SIP */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Вызовы в SIP</Text>

          {renderSlider(
            'Усиление микрофона панели',
            sipMicGain,
            setSipMicGain,
          )}

          <View style={styles.divider} />

          {renderSlider(
            'Громкость разговора на панели',
            sipPanelVolume,
            setSipPanelVolume,
          )}

          <View style={styles.divider} />

          {renderSlider(
            'Громкость в трубке при вызове с калитки',
            sipGateVolume,
            setSipGateVolume,
          )}
        </View>

        {/* Примечание */}
        <Text style={styles.noteText}>
          Уровень громкости для каждой квартиры можно настроить в разделе
          «Квартиры»
        </Text>

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
    padding: 12,
  },
  pageTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  sliderContainer: {
    paddingVertical: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 13,
    color: '#000',
  },
  sliderValueBadge: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 28,
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  slider: {
    width: '100%',
    height: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLabel: {
    fontSize: 13,
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
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
});

export default SoundScreen;

