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

const RebootScreen = ({navigation}: any) => {
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

  const handleRebootPress = () => {
    setShowFirstConfirm(true);
  };

  const handleFirstConfirm = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(true);
  };

  const handleFinalReboot = () => {
    setShowSecondConfirm(false);
    // Здесь будет логика перезагрузки
    console.log('Устройство перезагружается...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Перезагрузка</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Icon name="restart-alt" size={80} color="#5B9FED" />
          <Text style={styles.title}>Перезагрузка устройства</Text>
          <Text style={styles.description}>
            Перезагрузка устройства займет несколько минут. Во время перезагрузки
            устройство будет недоступно.
          </Text>
        </View>

        <TouchableOpacity style={styles.rebootButton} onPress={handleRebootPress}>
          <Icon name="restart-alt" size={20} color="#fff" />
          <Text style={styles.rebootButtonText}>Перезагрузить</Text>
        </TouchableOpacity>

        <View style={styles.warningBox}>
          <Icon name="warning" size={20} color="#FF9800" />
          <Text style={styles.warningText}>
            Убедитесь, что все важные операции завершены перед перезагрузкой
            устройства.
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
              Вы действительно хотите перезагрузить устройство?
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
              Вы уверены, что хотите перезагрузить устройство? Это действие нельзя
              отменить.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSecondConfirm(false)}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.finalRebootButton]}
                onPress={handleFinalReboot}>
                <Text style={styles.confirmButtonText}>Точно перезагрузить</Text>
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
    marginBottom: 40,
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
  rebootButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B9FED',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  rebootButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    marginLeft: 12,
    lineHeight: 20,
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
    marginBottom: 24,
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
  finalRebootButton: {
    backgroundColor: '#F44336',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RebootScreen;

