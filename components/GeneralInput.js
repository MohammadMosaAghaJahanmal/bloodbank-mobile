import { Text, TextInput, View } from "react-native";


const MUTED = '#7E7E7E';


const Input = function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry,
  returnKeyType,
  onBlur,
  error,
  icon,
  right,
  autoCapitalize = 'none',
  onSubmitEditing,
  isRTL,
  writingDirection,
  styles
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, !!error && styles.inputError]}>
        {icon && <Text style={styles.inputIcon}>{icon}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={MUTED}
          style={styles.input}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          returnKeyType={returnKeyType}
          onBlur={onBlur}
          autoCapitalize={autoCapitalize}
          textAlign={isRTL ? 'right' : 'left'}
          writingDirection={writingDirection}
          autoCorrect={false}
          spellCheck={false}
          // helpful extras
          onSubmitEditing={onSubmitEditing}
        />
        {right ? <View style={styles.inputRight}>{right}</View> : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};


export default Input;