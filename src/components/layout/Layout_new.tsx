import React from 'react'
import Header from '../Header'
import { colors, spacing, typography } from '../../styles/design-system'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background.secondary,
        fontFamily: typography.fontFamily.sans.join(', '),
      }}
    >
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${spacing[8]} ${spacing[6]}`,
          minHeight: 'calc(100vh - 140px)', // Вычитаем высоту header и footer
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: colors.background.primary,
          borderTop: `1px solid ${colors.gray[200]}`,
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `${spacing[6]} ${spacing[6]}`,
            textAlign: 'center' as const,
            color: colors.gray[500],
            fontSize: typography.fontSize.sm,
          }}
        >
          <p style={{ margin: 0 }}>
            © 2025 Daily Post. Создано для изучения современного веб-дизайна.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
