import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const EqualizerScreen = ({navigation}: any) => {
  const [lowFrequency, setLowFrequency] = useState(13);
  const [midFrequency, setMidFrequency] = useState(9);
  const [highFrequency, setHighFrequency] = useState(8);

  const handleSave = () => {
    console.log('Saving equalizer settings');
  };

  const renderSlider = (
    label: string,
    value: number,
    setValue: (value: number) => void,
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
        minimumValue={0}
        maximumValue={16}
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
        <Text style={styles.headerTitle}>Эквалайзер</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Эквалайзер</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Динамик панели</Text>

          {renderSlider('Низкие частоты', lowFrequency, setLowFrequency)}

          <View style={styles.divider} />

          {renderSlider('Средние частоты', midFrequency, setMidFrequency)}

          <View style={styles.divider} />

          {renderSlider('Высокие частоты', highFrequency, setHighFrequency)}
        </View>

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
  scrollContent: {
    paddingBottom: 32,
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

export default EqualizerScreen;

