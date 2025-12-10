import React, { HTMLAttributes } from 'react'
import {
  colors,
  borderRadius,
  shadows,
  spacing,
} from '../../styles/design-system'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  style = {},
  ...props
}) => {
  // Функция для получения стилей варианта
  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: borderRadius.lg,
      overflow: 'hidden' as const,
      backgroundColor: colors.background.primary,
    }

    switch (variant) {
      case 'default':
        return {
          ...baseStyles,
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: shadows.sm,
        }

      case 'outlined':
        return {
          ...baseStyles,
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: 'none',
        }

      case 'elevated':
        return {
          ...baseStyles,
          border: 'none',
          boxShadow: shadows.lg,
        }

      default:
        return baseStyles
    }
  }

  // Функция для получения стилей отступов
  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return { padding: spacing[4] }
      case 'md':
        return { padding: spacing[6] }
      case 'lg':
        return { padding: spacing[8] }
      case 'none':
        return { padding: '0' }
      default:
        return { padding: spacing[6] }
    }
  }

  return (
    <div
      style={{
        ...getVariantStyles(),
        ...getPaddingStyles(),
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

// Подкомпоненты для структурированного содержимого
export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style = {},
  ...props
}) => (
  <div
    style={{
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[100]}`,
      marginBottom: spacing[4],
      ...style,
    }}
    className={className}
    {...props}
  >
    {children}
  </div>
)

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style = {},
  ...props
}) => (
  <div style={style} className={className} {...props}>
    {children}
  </div>
)

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style = {},
  ...props
}) => (
  <div
    style={{
      paddingTop: spacing[4],
      borderTop: `1px solid ${colors.gray[100]}`,
      marginTop: spacing[4],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...style,
    }}
    className={className}
    {...props}
  >
    {children}
  </div>
)

export default Card
