import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
} from '../../styles/design-system'

// Определяем варианты кнопки
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

// Функция для получения стилей в зависимости от варианта
const getVariantStyles = (variant: ButtonVariant) => {
  const baseStyles = {
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.md,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: animation.transition.normal,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    textDecoration: 'none',
    outline: 'none',
    position: 'relative' as const,
  }

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: colors.primary[500],
        color: 'white',
        boxShadow: shadows.sm,
        // Hover состояние
        ':hover': {
          backgroundColor: colors.primary[600],
          boxShadow: shadows.md,
        },
        // Focus состояние для accessibility
        ':focus-visible': {
          outline: `2px solid ${colors.primary[500]}`,
          outlineOffset: '2px',
        },
        // Active состояние
        ':active': {
          backgroundColor: colors.primary[700],
          transform: 'translateY(1px)',
        },
        // Disabled состояние
        ':disabled': {
          backgroundColor: colors.gray[300],
          color: colors.gray[500],
          cursor: 'not-allowed',
          boxShadow: 'none',
          transform: 'none',
        },
      }

    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: colors.gray[100],
        color: colors.gray[700],
        border: `1px solid ${colors.gray[200]}`,
        ':hover': {
          backgroundColor: colors.gray[200],
          borderColor: colors.gray[300],
        },
        ':focus-visible': {
          outline: `2px solid ${colors.gray[400]}`,
          outlineOffset: '2px',
        },
        ':active': {
          backgroundColor: colors.gray[300],
          transform: 'translateY(1px)',
        },
        ':disabled': {
          backgroundColor: colors.gray[50],
          color: colors.gray[400],
          cursor: 'not-allowed',
          transform: 'none',
        },
      }

    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: colors.primary[600],
        border: `1px solid ${colors.primary[300]}`,
        ':hover': {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[400],
        },
        ':focus-visible': {
          outline: `2px solid ${colors.primary[500]}`,
          outlineOffset: '2px',
        },
        ':active': {
          backgroundColor: colors.primary[100],
          transform: 'translateY(1px)',
        },
        ':disabled': {
          backgroundColor: 'transparent',
          color: colors.gray[400],
          borderColor: colors.gray[200],
          cursor: 'not-allowed',
          transform: 'none',
        },
      }

    case 'ghost':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: colors.gray[600],
        border: 'none',
        ':hover': {
          backgroundColor: colors.gray[100],
        },
        ':focus-visible': {
          outline: `2px solid ${colors.gray[400]}`,
          outlineOffset: '2px',
        },
        ':active': {
          backgroundColor: colors.gray[200],
          transform: 'translateY(1px)',
        },
        ':disabled': {
          backgroundColor: 'transparent',
          color: colors.gray[400],
          cursor: 'not-allowed',
          transform: 'none',
        },
      }

    case 'danger':
      return {
        ...baseStyles,
        backgroundColor: colors.error[500],
        color: 'white',
        boxShadow: shadows.sm,
        ':hover': {
          backgroundColor: colors.error[600],
          boxShadow: shadows.md,
        },
        ':focus-visible': {
          outline: `2px solid ${colors.error[500]}`,
          outlineOffset: '2px',
        },
        ':active': {
          backgroundColor: colors.error[700],
          transform: 'translateY(1px)',
        },
        ':disabled': {
          backgroundColor: colors.gray[300],
          color: colors.gray[500],
          cursor: 'not-allowed',
          boxShadow: 'none',
          transform: 'none',
        },
      }

    default:
      return baseStyles
  }
}

// Функция для получения размеров
const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return {
        fontSize: typography.fontSize.sm,
        padding: `${spacing[2]} ${spacing[3]}`,
        minHeight: '32px',
      }
    case 'md':
      return {
        fontSize: typography.fontSize.base,
        padding: `${spacing[3]} ${spacing[4]}`,
        minHeight: '40px',
      }
    case 'lg':
      return {
        fontSize: typography.fontSize.lg,
        padding: `${spacing[4]} ${spacing[6]}`,
        minHeight: '48px',
      }
    default:
      return {
        fontSize: typography.fontSize.base,
        padding: `${spacing[3]} ${spacing[4]}`,
        minHeight: '40px',
      }
  }
}

// Основной компонент Button с forwardRef для совместимости с библиотеками форм
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      className = '',
      style = {},
      ...props
    },
    ref,
  ) => {
    // Объединяем стили
    const variantStyles = getVariantStyles(variant)
    const sizeStyles = getSizeStyles(size)

    const buttonStyles = {
      ...variantStyles,
      ...sizeStyles,
      ...style,
    }

    // Компонент загрузки
    const LoadingSpinner = () => (
      <div
        style={{
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderRightColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    )

    return (
      <>
        {/* Добавляем CSS для анимации спиннера */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>

        <button
          ref={ref}
          disabled={disabled || isLoading}
          style={buttonStyles}
          className={className}
          {...props}
        >
          {/* Левая иконка или спиннер загрузки */}
          {isLoading ? (
            <LoadingSpinner />
          ) : leftIcon ? (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {leftIcon}
            </span>
          ) : null}

          {/* Текст кнопки */}
          <span
            style={{
              opacity: isLoading ? 0.7 : 1,
              fontFamily: typography.fontFamily.sans.join(', '),
              lineHeight: typography.lineHeight.normal,
            }}
          >
            {children}
          </span>

          {/* Правая иконка */}
          {rightIcon && !isLoading && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {rightIcon}
            </span>
          )}
        </button>
      </>
    )
  },
)

Button.displayName = 'Button'

export default Button
