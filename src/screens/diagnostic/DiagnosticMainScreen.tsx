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

const DiagnosticMainScreen = ({navigation}: any) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'main',
      label: 'Данные о панели',
      icon: 'home',
      route: 'Main',
    },
    {
      id: 'intercom',
      label: 'Домофон',
      icon: 'door-sliding',
      submenu: [
        {id: 'keys', label: 'Ключи', route: 'Keys'},
        {id: 'apartments', label: 'Квартиры', route: 'Apartments'},
        {id: 'matrix', label: 'Матрица', route: 'Matrix'},
        {id: 'entrance', label: 'Вход', route: 'Entrance'},
        {id: 'runningLine', label: 'Бегущая строка', route: 'RunningLine'},
      ],
    },
    {
      id: 'audio',
      label: 'Аудио',
      icon: 'volume-up',
      submenu: [
        {id: 'sound', label: 'Звук', route: 'Sound'},
        {id: 'equalizer', label: 'Эквалайзер', route: 'Equalizer'},
      ],
    },
    {
      id: 'sip',
      label: 'SIP',
      icon: 'phone',
      submenu: [
        {id: 'sipAccount', label: 'SIP-Аккаунт', route: 'SipAccount'},
      ],
    },
    {
      id: 'video',
      label: 'Видео',
      icon: 'videocam',
      submenu: [
        {id: 'videoStream', label: 'Видеопоток', route: 'VideoStream'},
      ],
    },
    {
      id: 'network',
      label: 'Сеть',
      icon: 'settings-ethernet',
      submenu: [
        {id: 'ddns', label: 'DDNS', route: 'DDNS'},
        {id: 'networkSettings', label: 'Настройка сети', route: 'NetworkSettings'},
        {id: 'syslog', label: 'Syslog-сервер', route: 'Syslog'},
      ],
    },
    {
      id: 'system',
      label: 'Система',
      icon: 'settings',
      submenu: [
        {id: 'update', label: 'Обновление', route: 'Update'},
        {id: 'datetime', label: 'Дата и время', route: 'DateTime'},
        {id: 'reboot', label: 'Перезагрузка', route: 'Reboot'},
        {id: 'reset', label: 'Сброс устройства', route: 'Reset'},
      ],
    },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const navigateTo = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Диагностика</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        {menuItems.map(item => (
          <View key={item.id} style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                if (item.submenu) {
                  toggleMenu(item.id);
                } else {
                  navigateTo(item.route!);
                }
              }}>
              <View style={styles.menuButtonLeft}>
                <Icon name={item.icon} size={24} color="#000" />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              {item.submenu ? (
                <Icon
                  name={expandedMenu === item.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#666"
                />
              ) : (
                <Icon name="chevron-right" size={24} color="#666" />
              )}
            </TouchableOpacity>

            {item.submenu && expandedMenu === item.id && (
              <View style={styles.submenuContainer}>
                {item.submenu.map((subitem, index) => (
                  <TouchableOpacity
                    key={subitem.id}
                    style={[
                      styles.submenuItem,
                      index === item.submenu!.length - 1 && styles.submenuItemLast,
                    ]}
                    onPress={() => navigateTo(subitem.route)}>
                    <Text style={styles.submenuLabel}>{subitem.label}</Text>
                    <Icon name="chevron-right" size={20} color="#999" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
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
    borderBottomColor: '#E0E0E0',
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
  menuSection: {
    marginBottom: 12,
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  submenuContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  submenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  submenuItemLast: {
    borderBottomWidth: 0,
  },
  submenuLabel: {
    fontSize: 15,
    color: '#333',
  },
});

export default DiagnosticMainScreen;
