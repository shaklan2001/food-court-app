import Toast from 'react-native-toast-message';

export const showToast = ({
    message,
    type,
}: {
    message: string;
    type: 'success' | 'error' | 'info';
}) => {
    return Toast.show({
        type,
        text1: message,
        text1Style: {
            fontFamily: 'gilroy-bold',
        },
    });
};
