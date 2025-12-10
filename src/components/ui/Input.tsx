import React, { InputHTMLAttributes, forwardRef, useState } from 'react'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  animation,
} from '../../styles/design-system'

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled'
  size?: 'sm' | 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      size = 'md',
      className = '',
      style = {},
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    // Базовые стили для input
    const getInputStyles = () => {
      const baseStyles = {
        fontFamily: typography.fontFamily.sans.join(', '),
        fontSize:
          size === 'sm'
            ? typography.fontSize.sm
            : size === 'lg'
            ? typography.fontSize.lg
            : typography.fontSize.base,
        fontWeight: typography.fontWeight.normal,
        lineHeight: typography.lineHeight.normal,
        borderRadius: borderRadius.md,
        border: `1px solid ${error ? colors.error[500] : colors.gray[200]}`,
        backgroundColor:
          variant === 'filled' ? colors.gray[50] : colors.background.primary,
        color: colors.gray[900],
        transition: animation.transition.normal,
        outline: 'none',
        width: '100%',
        padding:
          size === 'sm'
            ? `${spacing[2]} ${spacing[3]}`
            : size === 'lg'
            ? `${spacing[4]} ${spacing[4]}`
            : `${spacing[3]} ${spacing[4]}`,
        paddingLeft: leftIcon
          ? size === 'sm'
            ? '2.5rem'
            : size === 'lg'
            ? '3.5rem'
            : '3rem'
          : undefined,
        paddingRight: rightIcon
          ? size === 'sm'
            ? '2.5rem'
            : size === 'lg'
            ? '3.5rem'
            : '3rem'
          : undefined,
      }

      // Состояния
      const stateStyles = {
        ':hover': !disabled
          ? {
              borderColor: error ? colors.error[600] : colors.gray[300],
            }
          : {},
        ':focus': {
          borderColor: error ? colors.error[500] : colors.primary[500],
          boxShadow: `0 0 0 3px ${
            error ? colors.error[50] : colors.primary[50]
          }`,
        },
        ':disabled': {
          backgroundColor: colors.gray[50],
          color: colors.gray[400],
          cursor: 'not-allowed',
          borderColor: colors.gray[200],
        },
      }

      return { ...baseStyles, ...stateStyles }
    }

    // Стили для label
    const labelStyles = {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: error ? colors.error[700] : colors.gray[700],
      marginBottom: spacing[1],
      display: 'block',
      fontFamily: typography.fontFamily.sans.join(', '),
    }

    // Стили для контейнера
    const containerStyles = {
      position: 'relative' as const,
      width: '100%',
    }

    // Стили для иконок
    const iconStyles = {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      color: error
        ? colors.error[500]
        : isFocused
        ? colors.primary[500]
        : colors.gray[400],
      transition: animation.transition.normal,
      pointerEvents: 'none' as const,
      width: size === 'sm' ? '16px' : size === 'lg' ? '20px' : '18px',
      height: size === 'sm' ? '16px' : size === 'lg' ? '20px' : '18px',
    }

    const leftIconStyles = {
      ...iconStyles,
      left: size === 'sm' ? spacing[2] : spacing[3],
    }

    const rightIconStyles = {
      ...iconStyles,
      right: size === 'sm' ? spacing[2] : spacing[3],
    }

    // Стили для текста ошибки и подсказки
    const helperTextStyles = {
      fontSize: typography.fontSize.sm,
      color: error ? colors.error[600] : colors.gray[500],
      marginTop: spacing[1],
      fontFamily: typography.fontFamily.sans.join(', '),
    }

    return (
      <div style={{ marginBottom: spacing[4] }}>
        {/* Label */}
        {label && <label style={labelStyles}>{label}</label>}

        {/* Input Container */}
        <div style={containerStyles}>
          {/* Left Icon */}
          {leftIcon && <div style={leftIconStyles}>{leftIcon}</div>}

          {/* Input Field */}
          <input
            ref={ref}
            style={{
              ...getInputStyles(),
              ...style,
            }}
            className={className}
            disabled={disabled}
            onFocus={e => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={e => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && <div style={rightIconStyles}>{rightIcon}</div>}
        </div>

        {/* Helper Text or Error */}
        {(error || helperText) && (
          <div style={helperTextStyles}>{error || helperText}</div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
