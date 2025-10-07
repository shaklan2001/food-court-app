import { memo, useCallback } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Text, View } from "../ui";

const QuantitySelector = memo(({ 
    itemId, 
    currentQuantity = 0, 
    onQuantityChange, 
}: { 
    itemId: string; 
    currentQuantity: number; 
    onQuantityChange: (itemId: string, quantity: number) => void;
}) => {
    const handleIncrement = useCallback(() => {
        onQuantityChange(itemId, currentQuantity + 1);
    }, [itemId, currentQuantity, onQuantityChange]);

    const handleDecrement = useCallback(() => {
        if (currentQuantity > 0) {
            onQuantityChange(itemId, currentQuantity - 1);
        }
    }, [itemId, currentQuantity, onQuantityChange]);

    if (currentQuantity === 0) {
        return (
            <TouchableOpacity onPress={handleIncrement}>
                <View
                    width={80}
                    backgroundColor="primary"
                    borderRadius="m"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text color="textOnPrimary" fontSize={12} fontFamily="Poppins-SemiBold">
                        Add
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View
            flexDirection="row"
            alignItems="center"
            backgroundColor="primary"
            borderRadius="m"
            minWidth={80}
        >
            <Pressable onPress={handleDecrement}>
                <View
                    width={25}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text color="textOnPrimary" fontSize={14} fontFamily="Poppins-Bold">
                        -
                    </Text>
                </View>
            </Pressable>
            
            <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                minWidth={30}
            >
                <Text color="textOnPrimary" fontSize={12} fontFamily="Poppins-SemiBold">
                    {currentQuantity}
                </Text>
            </View>
            
            <Pressable onPress={handleIncrement}>
                <View
                    width={25}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text color="textOnPrimary" fontSize={14} fontFamily="Poppins-Bold">
                        +
                    </Text>
                </View>
            </Pressable>
        </View>
    );
});

QuantitySelector.displayName = 'QuantitySelector';

export default QuantitySelector;