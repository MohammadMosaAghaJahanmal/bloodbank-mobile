import { Text, TextInput, View } from "react-native";
import { COLORS } from '../utils/styles';


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
  styles,
  multiline = false,
  numberOfLines = 4,
  textAlignVertical = 'top',
  inputStyle,
  containerStyle
}) {
  return (
    <View style={[{ marginBottom: 20 }, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrap, 
        multiline && styles.textareaWrap,
        !!error && styles.inputError
      ]}>
        {icon && <Text style={[
          styles.inputIcon,
          multiline && styles.textareaIcon 
        ]}>{icon}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          style={[
            styles.input,
            multiline && styles.textarea,
            inputStyle
          ]}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          returnKeyType={returnKeyType}
          onBlur={onBlur}
          autoCapitalize={autoCapitalize}
          textAlign={isRTL ? 'right' : 'left'}
          writingDirection={writingDirection}
          autoCorrect={false}
          spellCheck={false}
          // Multiline props
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          textAlignVertical={multiline ? textAlignVertical : 'center'}
          // Helpful extras
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={!multiline} // Don't blur on submit when multiline
        />
        {right ? <View style={[
          styles.inputRight,
          multiline && styles.textareaRight
        ]}>{right}</View> : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;