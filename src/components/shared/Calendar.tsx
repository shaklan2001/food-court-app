import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { memo, useCallback, useMemo } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { Theme } from '../../theme/theme';
import { Text, View } from '../ui';

const { width, height } = Dimensions.get('window');

interface CalendarProps {
    visible: boolean;
    onClose: () => void;
    onDateSelect: (dateString: string) => void;
    initialDate?: string;
    maxDate?: string;
    title?: string;
}

const Calendar = memo(({
    visible,
    onClose,
    onDateSelect,
    initialDate,
    maxDate = new Date().toISOString().split('T')[0],
    title = "Select Date",
}: CalendarProps) => {
    const theme = useTheme<Theme>();

    const calendarTheme = useMemo(() => ({
        backgroundColor: 'white',
        calendarBackground: 'white',
        textSectionTitleColor: theme.colors.textPrimary,
        selectedDayBackgroundColor: theme.colors.primary,
        selectedDayTextColor: 'white',
        todayTextColor: theme.colors.primary,
        dayTextColor: theme.colors.textPrimary,
        textDisabledColor: theme.colors.textSecondary,
        dotColor: theme.colors.primary,
        selectedDotColor: 'white',
        arrowColor: theme.colors.primary,
        disabledArrowColor: theme.colors.textSecondary,
        monthTextColor: theme.colors.textPrimary,
        indicatorColor: theme.colors.primary,
        textDayFontFamily: 'Poppins-Regular',
        textMonthFontFamily: 'Poppins-SemiBold',
        textDayHeaderFontFamily: 'Poppins-Medium',
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14,
    }), [theme.colors]);

    const handleDayPress = useCallback((day: { dateString: string }) => {
        onDateSelect(day.dateString);
        onClose();
    }, [onDateSelect, onClose]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom="l"
                    >
                        <Text
                            fontSize={18}
                            fontWeight="600"
                            color="textPrimary"
                            fontFamily="Poppins-SemiBold"
                        >
                            {title}
                        </Text>
                        <Pressable onPress={handleClose}>
                            <AntDesign name="close" size={24} color={theme.colors.textSecondary} />
                        </Pressable>
                    </View>
                    
                    <RNCalendar
                        onDayPress={handleDayPress}
                        theme={calendarTheme}
                        maxDate={maxDate}
                        initialDate={initialDate || maxDate}
                    />
                </View>
            </View>
        </Modal>
    );
});

Calendar.displayName = 'Calendar';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        margin: 20,
        width: width * 0.9,
        maxHeight: height * 0.7,
    },
});

export default Calendar;
