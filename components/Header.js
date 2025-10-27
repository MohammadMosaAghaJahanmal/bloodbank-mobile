import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, Text, View } from "react-native";
import { useRTLStyles } from "../contexts/useRTLStyles";
import { COLORS, globalStyle } from "../utils/styles";

const Header = (props) => {
  const navigation = useNavigation(); // ✅ public hook

  const openDrawer = () => {
    // Works only if this screen is inside a DrawerNavigator
    navigation.dispatch(DrawerActions.openDrawer());
    // or: navigation.openDrawer?.();
  };

  const { createRTLStyles, isRTL } = useRTLStyles();
  const styles = createRTLStyles(globalStyle);

  return (
    <View style={styles.headerWrap}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={[
          {
            paddingTop: Platform.OS === "ios" ? 50 : 40,
            paddingBottom: 16,
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          },
          {
            flexDirection: isRTL ? "row-reverse" : "row",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.decoCircleBig} />
        <View style={styles.decoCircleSmall} />

        <Pressable
          onPress={openDrawer}
          style={({ pressed }) => [
            styles.iconBtn,
            { marginHorizontal: 16 },
            pressed && styles.iconBtnPressed,
          ]}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.iconContainer,
                { transform: [{ scale: pressed ? 0.9 : 1 }] },
              ]}
            >
              <Ionicons name="menu" size={22} color="#fff" />
            </View>
          )}
        </Pressable>

        <View style={styles.titleBox}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {props.title}
          </Text>
          <Text numberOfLines={1} style={styles.headerSubtitle}>
            {props.subTitle}
          </Text>
        </View>

        <View style={styles.iconBtn} />
        <View style={styles.iconBtn} />
      </LinearGradient>
    </View>
  );
};

export default Header;
