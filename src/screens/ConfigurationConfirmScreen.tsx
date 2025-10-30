import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {deviceStore} from '../stores/DeviceStore';

const ConfigurationConfirmScreen = observer(({navigation}: any) => {
  const [isConfiguring, setIsConfiguring] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setIsConfiguring(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleComplete = () => {
    deviceStore.completeConfiguration();
    navigation.navigate('ModeSelection');
  };

  const handleReconfigure = () => {
    navigation.navigate('DeviceType');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Настройка устройства</Text>

        {isConfiguring ? (
          <View style={styles.progressContainer}>
            <View style={styles.messageBox}>
              <Text style={styles.message}>Настраиваем устройство...</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[styles.progressBarFill, {width: progressWidth}]}
              />
            </View>
          </View>
        ) : (
          <Animated.View style={{opacity: fadeAnim}}>
            <View style={styles.messageBox}>
              <Text style={styles.message}>
                Проверь, все ли работает. Если все работает, нажимай на
                "Настройка завершена". Если остались ошибки нажимай
                "Перенастроить".
              </Text>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}>
              <Text style={styles.completeButtonText}>
                Настройка завершена
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reconfigureButton}
              onPress={handleReconfigure}>
              <Text style={styles.reconfigureButtonText}>Перенастроить</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },
  progressContainer: {
    marginBottom: 32,
  },
  messageBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  message: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B9FED',
    borderRadius: 4,
  },
  completeButton: {
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  reconfigureButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reconfigureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ConfigurationConfirmScreen;

