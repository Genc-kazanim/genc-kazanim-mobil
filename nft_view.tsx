import React, { useState, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    PanResponder
} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {SocialIcon} from "react-native-elements";
import ConfettiCannon from "react-native-confetti-cannon";

interface NftViewProps {
    nftFullImageUrl: string;
    name: string;
    creationDate: string;
    certificationType: string;
    isVisible: boolean;
    onClose: () => void;
}

const NftView: React.FC<NftViewProps> = ({
                                             nftFullImageUrl,
                                             name,
                                             creationDate,
                                             certificationType,
                                             isVisible,
                                             onClose
                                         }) => {
    const [animation, setAnimation] = useState(new Animated.Value(0));

    const handleOpen = () => {
        Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnimation, {
            toValue: 0.95,
            speed: 14,
            bounciness: 10,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnimation, {
            toValue: 1,
            speed: 14,
            bounciness: 10,
            useNativeDriver: true,
        }).start();
    };
    const handleClose = () => {
        onClose();
    };

    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
    });

    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    React.useEffect(() => {
        if (isVisible) {
            handleOpen();
        }
    }, [isVisible]);
    const pan = useRef(new Animated.ValueXY()).current;

    const scalePressAnimation = useRef(new Animated.Value(1)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                Animated.spring(scalePressAnimation, {
                    toValue: 0.95,
                    speed: 14,
                    bounciness: 10,
                    useNativeDriver: true,
                }).start();
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    {
                        dx: pan.x,
                        dy: pan.y,
                    },
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                Animated.spring(scalePressAnimation, {
                    toValue: 1,
                    speed: 14,
                    bounciness: 10,
                    useNativeDriver: true,
                }).start();
                pan.flattenOffset();
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    speed: 14,
                    bounciness: 10,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;
    return (
        <View style={{ flex: 1 }}>
        <Modal visible={isVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.backdrop}>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.modalContainer,
                            {
                                transform: [
                                    { translateX: pan.x },
                                    { translateY: pan.y },
                                    { scale: scalePressAnimation },
                                    { scale }
                                ],
                                opacity
                            }
                        ]}
                    >
                        <LinearGradient // Gradyan rengini ekledik
                            colors={['#333333', '#111111']}
                            style={styles.modalContainer}
                        >
                        <Image source={{ uri: nftFullImageUrl }} style={styles.nftImage} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{name}</Text>
                            <Text style={styles.details}>katilma tarihi: {creationDate}</Text>
                            <Text style={styles.details}>kazanim: {certificationType}</Text>
                        </View>
                        </LinearGradient>
                    </Animated.View>
                </View>

            </TouchableWithoutFeedback>
            <View style={styles.fixedSocialMediaContainer}>
                <SocialIcon type="whatsapp" onPress={() => console.log('Share to WhatsApp')} />
                <SocialIcon type="instagram" onPress={() => console.log('Share to Instagram')} />
                <SocialIcon type="twitter" onPress={() => console.log('Share to TikTok')} />
                <SocialIcon type="linkedin" onPress={() => console.log('Share to LinkedIn')} />
            </View>
            <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
        </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {

        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowRadius: 20,
        shadowOpacity: 0.3,
    },
    nftImage: {
        width: 300,
        height: 300,
        borderRadius: 15,
    },
    textContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    details: {
        fontSize: 16,
        color: '#fff',
    },
    socialMediaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'transparent', // Set the background color to transparent
    },
    fixedSocialMediaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 50, // Add horizontal padding
    },

});

export default NftView;
