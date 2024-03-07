import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IconWithBackgroundProps {
    width: number;
    height: number;
    iconSize: number;
    iconColor: string;
    iconComponent: React.ElementType;
    iconName: string;
    backgroundColor: string;
}

const IconWithBackground: React.FC<IconWithBackgroundProps> = ({ width, height, iconSize, iconColor, iconComponent: Icon, iconName, backgroundColor }) => {
    return (
        <View style={[styles.container, { width, height }]}>
            <View style={[styles.background, { backgroundColor }]} />
            <Icon
                name={iconName}
                size={iconSize}
                color={iconColor}
                style={[styles.icon, { transform: [{ translateX: -iconSize/2 }, { translateY: -iconSize/2 }] }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        zIndex: 0,
    },
    icon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 1,
    },
});

export default IconWithBackground;