import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const Notification = {
  show: () => {},
};

export default function CustomNotification() {
  const [config, setConfig] = useState({ visible: false, type: 'success', text1: '', text2: '' });
  const translateY = useRef(new Animated.Value(-150)).current;

  const showNotification = useCallback((options) => {
    setConfig({ ...options, visible: true });

    Animated.timing(translateY, {
      toValue: 60,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setConfig((prev) => ({ ...prev, visible: false })));
    }, 3000);
  }, [translateY]);

  useEffect(() => {
    Notification.show = showNotification;
  }, [showNotification]);

  if (!config.visible) return null;

  const isError = config.type === 'error';

  return (
    <Animated.View style={[
      styles.container, 
      { transform: [{ translateY }] }, 
      isError ? styles.errorBg : styles.successBg
    ]}>
      <Feather name={isError ? "alert-circle" : "check-circle"} size={24} color="#fff" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{config.text1}</Text>
        {config.text2 ? <Text style={styles.message}>{config.text2}</Text> : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 9999,
  },
  successBg: { backgroundColor: '#10B981' },
  errorBg: { backgroundColor: '#EF4444' },
  textContainer: { marginLeft: 12, flex: 1 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  message: { color: '#fff', fontSize: 14, marginTop: 2 },
});