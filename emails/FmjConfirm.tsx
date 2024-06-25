import { Button } from '@react-email/button';
import { Html } from '@react-email/html';
import * as React from 'react';
import { Head } from '@react-email/head';
import { Img } from '@react-email/img';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

export interface Props {
    name: string;
    project: string;
    waitlist?: string;
}

export default function FmjConfirm(props: Props) {
    const { name, project } = props;

    return (
        <Html lang='de'>
        <Head />
        <Section style={main}>
          <Container style={container}>
            <Container style={{ ...paragraph, ...logo}}>
              <Img style={logoImg} src="https://wqmqbzzmicifozbuugji.supabase.co/storage/v1/object/public/general/android-chrome-512x512.png" />
              <Text>Ferien mit Jesus</Text>
            </Container>

            <Container style={content}>

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
                    }}
                  >
                    deine Anmeldung ist bei uns eingegangen. Wir prüfen noch den Zahlungseingang und bestätigen deine Anmeldung, sobald das Geld eingegangen ist. Wir bitten daher um etwas Geduld.
                  <br></br>
                    Projekt: {project};
                  <br></br>
                    {props.waitlist && ("Warteliste: " + props.waitlist)}
                  <br></br>
                  <br></br>
                    Mit Gottes Segen,
                  <br></br>
                    Dein Ferien mit Jesus - Team
                  </Text>
                </Container>
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
