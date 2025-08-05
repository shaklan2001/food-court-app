import {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial
} from '@expo/vector-icons';
import React from 'react';

export type IconSet =
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'Fontisto'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Zocial';

interface IconProps {
    set?: IconSet;
    name: string;
    size?: number;
    color?: string;
}

const IconComponents = {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial
};

export const Icon: React.FC<IconProps> = ({
    set = 'Ionicons',
    name,
    size = 24,
    color = '#000'
}) => {
    const IconComponent = IconComponents[set];
    return <IconComponent name={name as any} size={size} color={color} />;
};