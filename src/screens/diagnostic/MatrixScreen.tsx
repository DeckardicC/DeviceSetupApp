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
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MatrixCell {
  row: string;
  col: string;
  value: string;
}

const MatrixScreen = ({navigation}: any) => {
  const [selectedSwitch, setSelectedSwitch] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [analogExpanded, setAnalogExpanded] = useState(false);
  const [checkFirstApt, setCheckFirstApt] = useState('');
  const [checkLastApt, setCheckLastApt] = useState('');
  const [autoFirstApt, setAutoFirstApt] = useState('');
  const [autoLastApt, setAutoLastApt] = useState('');
  const [editingCell, setEditingCell] = useState<MatrixCell | null>(null);
  const [cellValue, setCellValue] = useState('');

  // Генерация начальной матрицы
  const generateInitialMatrix = (): string[][] => {
    const matrix: string[][] = [];
    const rows = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'];
    
    for (let i = 0; i < 10; i++) {
      const row: string[] = [];
      for (let j = 0; j < 10; j++) {
        if (i === 0) {
          // Первая строка: 100, 10, 20, 30...90
          row.push(j === 0 ? '100' : (j * 10).toString());
        } else {
          // Остальные строки: 1-9, 11-19, 21-29...
          row.push((i + j * 10).toString());
        }
      }
      matrix.push(row);
    }
    return matrix;
  };

  const [matrix, setMatrix] = useState<string[][]>(generateInitialMatrix());

  const columns = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'];
  const rows = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'];

  const handleCellPress = (rowIndex: number, colIndex: number) => {
    if (!editMode) return;
    
    setEditingCell({
      row: rows[rowIndex],
      col: columns[colIndex],
      value: matrix[rowIndex][colIndex],
    });
    setCellValue(matrix[rowIndex][colIndex]);
  };

  const handleSaveCell = () => {
    if (!editingCell) return;

    const rowIndex = rows.indexOf(editingCell.row);
    const colIndex = columns.indexOf(editingCell.col);

    const newMatrix = [...matrix];
    newMatrix[rowIndex][colIndex] = cellValue;
    setMatrix(newMatrix);
    setEditingCell(null);
    setCellValue('');
  };

  const handleCheckAnalog = () => {
    if (!checkFirstApt || !checkLastApt) {
      Alert.alert('Ошибка', 'Заполните номера квартир');
      return;
    }
    Alert.alert(
      'Проверка аналоговых трубок',
      `Запущена проверка для квартир ${checkFirstApt}-${checkLastApt}`,
    );
  };

  const handleAutoSetup = () => {
    if (!autoFirstApt || !autoLastApt) {
      Alert.alert('Ошибка', 'Заполните номера квартир');
      return;
    }
    Alert.alert(
      'Автонастройка',
      `Запущена автонастройка для квартир ${autoFirstApt}-${autoLastApt}`,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Матрица</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Настройка матрицы ККМ</Text>

        {/* Выбор коммутатора */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.switchSelector}>
          {[1, 2, 3, 4].map(num => (
            <TouchableOpacity
              key={num}
              style={[
                styles.switchTab,
                selectedSwitch === num && styles.switchTabActive,
              ]}
              onPress={() => setSelectedSwitch(num)}>
              <Icon name="router" size={16} color="#fff" />
              <Text style={styles.switchTabText}>Коммутатор №{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.switchTabOutlined}>
            <Icon name="auto-awesome" size={16} color="#5B9FED" />
            <Text style={styles.switchTabOutlinedText}>
              Мастер автозаполнения
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Информация о коммутаторе */}
        <View style={styles.switchInfo}>
          <View>
            <Text style={styles.switchInfoLabel}>Коммутатор</Text>
            <Text style={styles.switchInfoValue}>Цифрал — КМГ-100</Text>
          </View>
          <View style={styles.switchInfoRight}>
            <Text style={styles.editModeLabel}>Режим редактирования матрицы</Text>
            <Switch
              value={editMode}
              onValueChange={setEditMode}
              trackColor={{false: '#ccc', true: '#5B9FED'}}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Состояние аналоговых трубок */}
        <TouchableOpacity
          style={styles.analogSection}
          onPress={() => setAnalogExpanded(!analogExpanded)}>
          <Text style={styles.analogTitle}>Состояние аналоговых трубок</Text>
          <Icon
            name={analogExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color="#000"
          />
        </TouchableOpacity>

        {analogExpanded && (
          <View style={styles.analogContent}>
            {/* Проверка состояний */}
            <View style={styles.analogBlock}>
              <View style={styles.analogBlockHeader}>
                <Text style={styles.analogBlockTitle}>
                  Проверка состояний аналоговых трубок
                </Text>
              </View>
              <View style={styles.analogInputs}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Номер первой квартиры *</Text>
                  <TextInput
                    style={styles.input}
                    value={checkFirstApt}
                    onChangeText={setCheckFirstApt}
                    keyboardType="numeric"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Номер последней квартиры *
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={checkLastApt}
                    onChangeText={setCheckLastApt}
                    keyboardType="numeric"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.runButton}
                onPress={handleCheckAnalog}>
                <Icon name="play-arrow" size={20} color="#fff" />
                <Text style={styles.runButtonText}>Запустить для всех</Text>
              </TouchableOpacity>
            </View>

            {/* Автонастройка */}
            <View style={styles.analogBlock}>
              <View style={styles.analogBlockHeader}>
                <Text style={styles.analogBlockTitle}>
                  Автонастройка состояний аналоговых трубок
                </Text>
              </View>
              <View style={styles.analogInputs}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Номер первой квартиры *</Text>
                  <TextInput
                    style={styles.input}
                    value={autoFirstApt}
                    onChangeText={setAutoFirstApt}
                    keyboardType="numeric"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Номер последней квартиры *
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={autoLastApt}
                    onChangeText={setAutoLastApt}
                    keyboardType="numeric"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.runButton}
                onPress={handleAutoSetup}>
                <Icon name="play-arrow" size={20} color="#fff" />
                <Text style={styles.runButtonText}>Запустить для всех</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

                {/* Матрица */}
                <View style={styles.matrixWrapper}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View style={styles.matrixContainer}>
                      {/* Заголовок таблицы */}
                      <View style={styles.matrixHeader}>
                        <View style={[styles.matrixHeaderCell, styles.cornerCell]}>
                          <Text style={styles.matrixHeaderText}>#</Text>
                        </View>
                        {columns.map(col => (
                          <View key={col} style={styles.matrixHeaderCell}>
                            <Text style={styles.matrixHeaderText}>{col}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Строки матрицы */}
                      {rows.map((row, rowIndex) => (
                        <View key={row} style={styles.matrixRow}>
                          <View style={styles.matrixRowHeaderCell}>
                            <Text style={styles.matrixRowHeaderText}>{row}</Text>
                          </View>
                          {columns.map((col, colIndex) => (
                            <TouchableOpacity
                              key={`${row}-${col}`}
                              style={[
                                styles.matrixCell,
                                editMode && styles.matrixCellEditable,
                              ]}
                              onPress={() => handleCellPress(rowIndex, colIndex)}
                              disabled={!editMode}>
                              <Text style={styles.matrixCellText}>
                                {matrix[rowIndex][colIndex]}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                  {editMode && (
                    <Text style={styles.matrixHint}>
                      Нажмите на ячейку для редактирования
                    </Text>
                  )}
                </View>
      </ScrollView>

      {/* Модальное окно редактирования ячейки */}
      <Modal
        visible={editingCell !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingCell(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Редактировать ячейку {editingCell?.row}-{editingCell?.col}
            </Text>

            <Text style={styles.inputLabel}>Значение</Text>
            <TextInput
              style={styles.modalInput}
              value={cellValue}
              onChangeText={setCellValue}
              keyboardType="numeric"
              placeholder="Введите значение"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingCell(null)}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveCell}>
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
  switchSelector: {
    marginBottom: 16,
  },
  switchTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B9FED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  switchTabActive: {
    backgroundColor: '#1976D2',
  },
  switchTabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  switchTabOutlined: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5B9FED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  switchTabOutlinedText: {
    color: '#5B9FED',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  switchInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  switchInfoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  switchInfoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  switchInfoRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  editModeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'right',
  },
  analogSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analogTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  analogContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  analogBlock: {
    marginBottom: 20,
  },
  analogBlockHeader: {
    marginBottom: 12,
  },
  analogBlockTitle: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  analogInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    color: '#000',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B9FED',
    padding: 12,
    borderRadius: 8,
  },
  runButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  matrixWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  matrixContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  matrixHeader: {
    flexDirection: 'row',
    backgroundColor: '#5B9FED',
  },
  matrixHeaderCell: {
    width: 50,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  matrixHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  cornerCell: {
    backgroundColor: '#4A8DD6',
  },
  matrixRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  matrixRowHeaderCell: {
    width: 50,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  matrixRowHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  matrixCell: {
    width: 50,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  matrixCellEditable: {
    backgroundColor: '#FFF9E6',
  },
  matrixCellText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '500',
  },
  matrixHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
  modalInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#000',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
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

export default MatrixScreen;

