import { Text, View } from '@/src/components/ui';

const OrderNow = () => {
    return (
        <View flex={1} bg="mainBackground" justifyContent="center" alignItems="center">
            <Text variant="header" color="primary">
                Order Now Tab
            </Text>
            <Text variant="body" color="textSecondary" marginTop="s">
                Order your food now
            </Text>
        </View>
    );
};

export default OrderNow;
