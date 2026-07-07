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

interface WaitlistConfirmationEmailProps {
  firstName: string
}

export function WaitlistConfirmationEmail({ firstName }: WaitlistConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your application is on file with Mile One Recruiting</Preview>
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
              Thanks for applying with Mile One Recruiting. Right now our recruiting is focused
              on flatbed positions, so we don&apos;t have current openings for dry van or reefer
              drivers.
            </Text>
            <Text style={{ fontSize: '16px', color: '#111827', lineHeight: '24px' }}>
              We&apos;re keeping your application on file and will reach out if that changes.
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

export default WaitlistConfirmationEmail
