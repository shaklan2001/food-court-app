import { Text, View } from '@/src/components/ui';
import theme from '@/src/theme/theme';
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const CheckIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <Path
            d="M13.3327 4L5.99935 11.3333L2.66602 8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
        <View style={styles.container}>
            {/* Progress Line */}
            <View style={styles.lineContainer}>
                <View style={[styles.line, { width: '100%' }]} />
                <View
                    style={[
                        styles.lineProgress,
                        {
                            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                        },
                    ]}
                />
            </View>

            {/* Step Circles */}
            {Array.from({ length: totalSteps }, (_, index) => {
                const step = index + 1;
                const isCompleted = step < currentStep;
                const isActive = step === currentStep;

                return (
                    <View
                        key={step}
                        style={[
                            styles.stepCircle,
                            {
                                left: `${(index / (totalSteps - 1)) * 100}%`,
                                transform: [{ translateX: -11 }],
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.circle,
                                (isCompleted || isActive) && styles.circleActive,
                            ]}
                        >
                            {isCompleted ? (
                                <CheckIcon />
                            ) : (
                                <Text
                                    style={[
                                        styles.stepText,
                                        (isCompleted || isActive) && styles.stepTextActive,
                                    ]}
                                >
                                    {step}
                                </Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 22,
        width: '100%',
        marginVertical: 20,
    },
    lineContainer: {
        position: 'absolute',
        top: 10,
        left: 26,
        right: 26,
        height: 1,
    },
    line: {
        position: 'absolute',
        height: 1,
        backgroundColor: 'rgba(162, 5, 56, 0.2)',
    },
    lineProgress: {
        position: 'absolute',
        height: 1,
        backgroundColor: theme.colors.primary,
    },
    stepCircle: {
        position: 'absolute',
        top: 0,
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(162, 5, 56, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleActive: {
        backgroundColor: theme.colors.primary,
    },
    stepText: {
        fontSize: 14,
        fontFamily: 'SF Pro',
        color: theme.colors.mainBackground,
        fontWeight: '400',
    },
    stepTextActive: {
        color: theme.colors.mainBackground,
    },
});

