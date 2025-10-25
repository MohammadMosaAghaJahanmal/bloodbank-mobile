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
  styles,
  // New props for textarea support
  multiline = false,
  numberOfLines = 4,
  textAlignVertical = 'top',
  // Additional styling props
  inputStyle,
  containerStyle
}) {
  return (
    <View style={[{ marginBottom: 20 }, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrap, 
        multiline && styles.textareaWrap, // Additional style for textarea
        !!error && styles.inputError
      ]}>
        {icon && <Text style={[
          styles.inputIcon,
          multiline && styles.textareaIcon // Additional style for textarea icon
        ]}>{icon}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={MUTED}
          style={[
            styles.input,
            multiline && styles.textarea, // Additional style for textarea
            inputStyle // Allow custom input styling
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
          multiline && styles.textareaRight // Additional style for textarea right element
        ]}>{right}</View> : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;