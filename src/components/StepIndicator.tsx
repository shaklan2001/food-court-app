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
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <Path
            d="M10 3L4.5 8.5L2 6"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
        <View style={styles.container}>
            <View style={styles.lineContainer}>
                <View style={[styles.line, { width: '100%' }]} />
                <View
                    style={[
                        styles.lineProgress,
                        {
                            width: totalSteps > 1 
                                ? `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
                                : '0%',
                        },
                    ]}
                />
            </View>

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
                                left: totalSteps > 1 
                                    ? `${(index / (totalSteps - 1)) * 100}%`
                                    : '50%',
                                transform: [{ translateX: -12 }],
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.circle,
                                isCompleted && styles.circleCompleted,
                                isActive && styles.circleActive,
                            ]}
                        >
                            {isCompleted ? (
                                <CheckIcon />
                            ) : (
                                <Text
                                    style={[
                                        styles.stepText,
                                        isActive && styles.stepTextActive,
                                        !isActive && !isCompleted && styles.stepTextInactive,
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
        height: 24,
        width: '100%',
        marginVertical: 24,
    },
    lineContainer: {
        position: 'absolute',
        top: 11,
        left: 12,
        right: 12,
        height: 2,
    },
    line: {
        position: 'absolute',
        height: 2,
        width: '100%',
        backgroundColor: 'rgba(162, 5, 56, 0.2)',
        borderRadius: 1,
    },
    lineProgress: {
        position: 'absolute',
        height: 2,
        backgroundColor: theme.colors.textPrimary,
        borderRadius: 1,
    },
    stepCircle: {
        position: 'absolute',
        top: 0,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(162, 5, 56, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
    },
    circleCompleted: {
        backgroundColor: theme.colors.primary,
    },
    circleActive: {
        backgroundColor: theme.colors.primary,
    },
    stepText: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
    },
    stepTextActive: {
        color: theme.colors.mainBackground,
    },
    stepTextInactive: {
        color: 'rgba(162, 5, 56, 0.4)',
    },
});

