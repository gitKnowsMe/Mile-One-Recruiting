import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

const NAVY = '#0a0a4d'
const ORANGE = '#ea580c'

interface StandardConfirmationEmailProps {
  firstName: string
}

export function StandardConfirmationEmail({ firstName }: StandardConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We received your flatbed driver application</Preview>
      <Body style={{ backgroundColor: '#f4f4f5', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            margin: '40px auto',
            maxWidth: '480px',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Section style={{ backgroundColor: NAVY, padding: '24px 32px' }}>
            <Heading style={{ color: '#ffffff', fontSize: '20px', margin: 0 }}>
              Mile One Recruiting
            </Heading>
          </Section>
          <Section style={{ padding: '32px' }}>
            <Text style={{ fontSize: '16px', color: '#111827' }}>Hi {firstName},</Text>
            <Text style={{ fontSize: '16px', color: '#111827', lineHeight: '24px' }}>
              Thanks for applying for a flatbed OTR driving position with Mile One Recruiting.
              We&apos;ve received your application and our recruiting team will be in touch
              shortly to discuss next steps.
            </Text>
            <Text style={{ fontSize: '16px', color: '#111827', lineHeight: '24px' }}>
              In the meantime, if you have any questions, reply to this email and we&apos;ll get
              back to you.
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: ORANGE,
                fontWeight: 'bold',
                marginTop: '24px',
              }}
            >
              — The Mile One Recruiting Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default StandardConfirmationEmail
