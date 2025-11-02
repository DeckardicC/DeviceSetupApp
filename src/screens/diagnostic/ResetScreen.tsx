import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResetScreen = ({navigation}: any) => {
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

  const handleResetPress = () => {
    setShowFirstConfirm(true);
  };

  const handleFirstConfirm = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(true);
  };

  const handleFinalReset = () => {
    setShowSecondConfirm(false);
    // Здесь будет логика сброса
    console.log('Сброс устройства...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Сброс устройства</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Icon name="settings-backup-restore" size={80} color="#F44336" />
          <Text style={styles.title}>Сброс к заводским настройкам</Text>
          <Text style={styles.description}>
            Все настройки устройства будут сброшены до заводских значений. Это
            действие невозможно отменить.
          </Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
          <Icon name="settings-backup-restore" size={20} color="#fff" />
          <Text style={styles.resetButtonText}>Сбросить устройство</Text>
        </TouchableOpacity>

        <View style={styles.warningBox}>
          <Icon name="warning" size={20} color="#F44336" />
          <Text style={styles.warningText}>
            ВНИМАНИЕ! Это действие удалит все настройки и вернет устройство к
            заводскому состоянию. Убедитесь, что вы сохранили важные данные перед
            выполнением сброса.
          </Text>
        </View>
      </View>

      {/* Первое подтверждение */}
      <Modal
        visible={showFirstConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFirstConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Icon name="warning" size={48} color="#FF9800" />
            </View>
            <Text style={styles.modalTitle}>Предупреждение</Text>
            <Text style={styles.modalText}>
              Вы действительно хотите сбросить устройство к заводским настройкам?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowFirstConfirm(false)}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleFirstConfirm}>
                <Text style={styles.confirmButtonText}>Да</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Второе подтверждение */}
      <Modal
        visible={showSecondConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSecondConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Icon name="warning" size={48} color="#F44336" />
            </View>
            <Text style={styles.modalTitle}>Подтверждение</Text>
            <Text style={styles.modalText}>
              Вы уверены, что хотите сбросить устройство? Все данные будут удалены
              безвозвратно!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSecondConfirm(false)}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.finalResetButton]}
                onPress={handleFinalReset}>
                <Text style={styles.confirmButtonText}>Точно сбросить</Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#C62828',
    marginLeft: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B9FED',
  },
  cancelButtonText: {
    color: '#5B9FED',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  finalResetButton: {
    backgroundColor: '#F44336',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ResetScreen;

