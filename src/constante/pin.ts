// Définition de l'objet JavaScript Pin qui contiendra les broches des différentes cartes
export const Pin = {
    // Propriété pour la carte Raspberry Pi 3B
    raspberryPi3b: {
        // Broche X1 avec une tension de 3,3 V
        'VCC_3v3_X1': null,
        // Broche X2 avec une tension de 5 V
        'VCC_5v_X2': null,
        // Broche X3 utilisée pour la communication I2C (données)
        'BCM2_SDA_X3': 2,
        // Broche X4 avec une tension de 5 V
        'VCC_5v_X4': null,
        // Broche X5 utilisée pour la communication I2C (horloge)
        'BCM3_SCL_X5': 3,
        // Broche X6 à la masse (non connectée)
        'Mass_X6': null,
        // Broche X7 utilisée pour générer un signal PWM (Pulse Width Modulation)
        'BCM4_GPCLK0_X7': 4,
        // Broche X8 utilisée pour la transmission série (TXD)
        'BCM14_TXD_X8': 14,
        // Broche X9 à la masse (non connectée)
        'Mass_X9': null,
        // Broche X10 utilisée pour la transmission série (TXD)
        'BCM15_TXD_X10': 15,
        // Broche X11 avec une valeur logique de 1
        'BCM17_X11': 17,
        // Broche X12 utilisée pour le contrôle de la luminosité PWM (PWL0)
        'BCM18_PWL0_X12': 18,
        // Broche X13 avec une valeur logique de 1
        'BCM27_X13': 27,
        // Broche X14 à la masse (non connectée)
        'Mass_X14': null,
        // Broche X15 avec une valeur logique de 1
        'BCM22_X15': 22,
        // Broche X16 avec une valeur logique de 1
        'BCM23_X16': 23,
        // Broche X17 avec une tension de 3,3 V
        'VCC_3v3_X17': null,
        // Broche X18 avec une valeur logique de 1
        'BCM24_X18': 24,
        // Broche X19 utilisée pour la communication SPI (données)
        'BCM10_MOSI_X19': 10,
        // Broche X20 à la masse (non connectée)
        'Mass_X20': null,
        // Broche X21 utilisée pour la communication SPI (données)
        'BCM9_MISO_X21': 9,
        // Broche X22 utilisée pour la communication SPI (horloge)
        'BCM25_X22': 25,
        // Broche X23 utilisée pour la communication SPI (horloge)
        'BCM11_SCLK_X23': 11,
        // Broche X24 utilisée pour la communication SPI (sélection du périphérique)
        'BCM8_CEO_X24': 8,
        // Broche X25 à la masse (non connectée)
        'Mass_X25': null,
        // Broche X26 utilisée pour la communication SPI (sélection du périphérique)
        'BCM7_CE1_X26': 7
    },
    orangePi4lts:{
        'VCC_3v3_X1': null,
        'VCC_5v_X2': null,
        'GPIO1_C4_I2C2_SDA_X3': 64,
        'VCC_5v_X4': null,
        'GPIO1_C5_I2C2_SCL_X5': 65,
        'Mass_X6': null,
        'GPIO4_C6_PWM1_X7': 150,
        'GPIO4_C1_I2C3_SCL_X8': 145,
        'Mass_X9': null,
        'GPIO4_C1_I2C3_SCL_X10': 144,
        'GPIO1_A1_X11': 33,
        'GPIO1_C6_X12': 50,
        'GPIO1_A3_X13': 35,
        'Mass_X14': null,
        'GPIO2_D4_X15': 92,
        'GPIO1_C6_X16': 54,
        'VCC_3v3_X17': null,
        'GPIO1_C7_X18': 55,
        'GPIO1_B0_SPI1_TXD_X19': 40, // Broche utilisée pour la transmission de données pour le bus SPI
        'Mass_X20': null,
        'GPIO1_A7_SPI1_RXD_X21': 39, // Broche utilisée pour la réception de données pour le bus SPI
        'GPIO1_D0_X22': 56,
        'GPIO1_B1_SPI1_CLK_X23': 41, // Broche utilisée pour la synchronisation des données pour le bus SPI
        'GPIO1_B0_SPI1_CS_X24': 42, // Broche utilisée pour la sélection du périphérique pour le bus SPI
        'Mass_X25': null,
        'GPIO4_C5_X26': 149,


    }
}