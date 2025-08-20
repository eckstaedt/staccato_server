import { Button } from '@react-email/button';
import { Html } from '@react-email/html';
import * as React from 'react';
import { Head } from '@react-email/head';
import { Img } from '@react-email/img';
import { Container } from '@react-email/container';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

export interface Props {
    email: string;
    password: string;
    name: string;
    appName: string;
    url: string;
    imageUrl: string;
}

export default function AttRegister(props: Props) {
    const { email, password, name, appName, url, imageUrl } = props;

    return (
        <Html lang='de'>
        <Head />
        <Preview>Deine Zugangsdaten für die Anwesenheits App</Preview>
        <Section style={main}>
          <Container style={container}>
            <Container style={{ ...paragraph, ...logo}}>
              <Img style={logoImg} src="https://ultyjzgwejpehfjuyenr.supabase.co/storage/v1/object/public/profiles/favicon.png" />
              <Text>{ appName } Anwesenheit</Text>
            </Container>

            <Container style={content}>
              <Img style={headerImgStyle} width={620} src={imageUrl} />

              <Container style={boxInfos}>
                <Container>
                  <Text
                    style={{
                      ...paragraph,
                      fontSize: 28,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Shalom {name},
                  </Text>
                  <Text
                    style={{
                      ...paragraph,
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Anbei erhälst du deine Login Daten für die {appName} App.
                  </Text>
                </Container>

                <Text style={paragraph}>
                  E-Mail: {email}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  Passwort: {password}
                </Text>
                <Section style={containerButton}>
                  <Button href={url} style={button}>Zur App</Button>
                </Section>
              </Container>
            </Container>

            <Text
              style={{
                ...paragraph,
                textAlign: 'center',
                fontSize: 12,
                color: 'rgb(0,0,0, 0.7)',
              }}
            >
              © 2024 | <a style={{ textDecoration: "none", color: "rgb(0,0,0, 0.7)", fontSize: "12px" }} href='https://www.fecg-speyer.de'>www.fecg-speyer.de</a>
            </Text>
          </Container>
        </Section>
      </Html>
    );
}

const logoImg = {
    height: "60px",
    width: "60px",
    paddingRight: "10px",
};

const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

const main = {
  backgroundColor: '#fff',
};

const paragraph = {
  fontSize: 16,
  fontFamily,
};

const container = {
  width: '620px',
  margin: '0 auto',
};

const logo = {
  display: 'flex',
  padding: '10px 10px',
};

const containerButton = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const button = {
  backgroundColor: '#438e96',
  padding: '12px 30px',
  borderRadius: 3,
  color: '#FFF',
  fontWeight: 'bold',
  border: '1px solid rgb(0,0,0, 0.1)',
  fontFamily,
  cursor: 'pointer',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
  gridAutoFlow: 'row',
};

const boxInfos = {
  padding: '20px 40px',
};

const headerImgStyle: any = {
    height: "300px",
    objectFit: "cover",
};
