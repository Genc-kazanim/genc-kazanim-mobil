import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const NftCard = ({
                     nftImageUrl,
                     profileImageUrl,
                     name,
                     creationDate,
                     verildigiyer,
                     certificationType,
                     onViewClick
                 }) => {
    return (
        <LinearGradient
            colors={['#333333', '#111111']}
            style={styles.cardContainer}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: nftImageUrl }} style={styles.nftImage} />
                <TouchableOpacity onPress={onViewClick} style={styles.profileButton}>
                    <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.creationDate}>{verildigiyer}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.certificationType}>{creationDate}</Text>
                <TouchableOpacity onPress={onViewClick} style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>incele</Text>
                </TouchableOpacity>
            </View>
</LinearGradient>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        width: '45%',
        maxWidth: '45%', // Bir satırda iki kart için
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        padding: 10,
        margin: 15,

    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 150, // Yüksekliği azalt
    },
    nftImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        resizeMode: 'cover',
    },
    profileButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    creationDate: {
        fontSize: 14,
        color: 'grey',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    certificationType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    viewButton: {
        backgroundColor: '#333333',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    viewButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NftCard;
