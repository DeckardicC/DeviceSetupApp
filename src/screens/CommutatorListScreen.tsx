import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {observer} from 'mobx-react-lite';
import {deviceStore} from '../stores/DeviceStore';
import {Commutator} from '../types';

const CommutatorListScreen = observer(({navigation}: any) => {
  const {commutators, selectedCommutator} = deviceStore;

  const handleCommutatorSelect = (commutator: Commutator) => {
    deviceStore.setCommutator(commutator);
    navigation.navigate('PortList');
  };

  const renderCommutator = ({
    item,
    index,
  }: {
    item: Commutator;
    index: number;
  }) => {
    const isSelected = selectedCommutator?.id === item.id;
    const isFirst = index === 0;
    const isLast = index === commutators.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.commutatorItem,
          isSelected && styles.commutatorSelected,
          isFirst && styles.commutatorItemFirst,
          isLast && styles.commutatorItemLast,
          !isLast && styles.commutatorItemBorder,
        ]}
        onPress={() => handleCommutatorSelect(item)}>
        <Icon name="router" size={24} color={isSelected ? '#fff' : '#000'} />
        <Text
          style={[
            styles.commutatorText,
            isSelected && styles.commutatorTextSelected,
          ]}>
          {item.name} ({item.availablePorts})
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Выбор коммутатора</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Коммутаторы на доме:</Text>
        </View>

        <View style={styles.whiteContainer}>
          <FlatList
            data={commutators}
            renderItem={renderCommutator}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
});

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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  commutatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  commutatorItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  commutatorItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  commutatorItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  commutatorSelected: {
    backgroundColor: '#5B9FED',
  },
  commutatorText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  commutatorTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CommutatorListScreen;

